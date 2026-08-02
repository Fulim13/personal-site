---
title: What Kafka actually guarantees
pubDate: 2026-07-18
featured: true
tags:
  - kafka
  - distributed systems
description: >-
  "Exactly once" is doing a lot of work in that sentence. A short tour of the
  guarantees Kafka really makes, and the three places teams assume more.
---

Every team I have worked on has had the same conversation about Kafka roughly
eighteen months in, usually at the wrong time of night. Someone says *"but
Kafka guarantees ordering"*, someone else says *"only within a partition"*, and
the incident channel goes quiet for a moment.

This is a short note on what the guarantees actually are, written mostly so I
stop having to reconstruct it from memory.

## Ordering is per-partition, not per-topic

This is the one that catches people. Kafka guarantees that messages within a
**single partition** are delivered in the order they were written. Across
partitions, there is no ordering at all — and a topic with twelve partitions is
twelve independent ordered logs that happen to share a name.

If two events must be processed in order relative to each other, they have to
land in the same partition. That means they need the same key:

```java
// Same key → same partition → ordering preserved between these two events.
producer.send(new ProducerRecord<>("orders", order.customerId(), event));
```

Use a null key and the producer will spread records across partitions for
throughput. That is usually what you want, right up until it isn't.

## "Exactly once" is narrower than it sounds

Kafka's exactly-once semantics are real, but they cover a **specific path**:
consume from Kafka, transform, produce back to Kafka, all inside one
transaction. Within that boundary, it works.

What it does not cover is the thing most services actually do — read from Kafka
and write to a database, or call an external API. The moment your side effect
leaves Kafka, you are back to at-least-once, and you need the consumer to be
idempotent. There is no configuration flag that fixes this.

> If your handler is not safe to run twice with the same input, you do not have
> exactly-once delivery. You have a bug that has not fired yet.

## A committed offset is a promise about the future

`enable.auto.commit=true` commits offsets on a timer, not when your handler
finishes. So a rebalance or a crash between the commit and the end of your
processing loses the message quietly — no error, no dead letter, just a gap.

The fix is to commit after the work succeeds, not before:

| Setting | Effect |
| --- | --- |
| `enable.auto.commit=true` | Simple. Can lose messages on crash |
| Manual commit after handling | At-least-once. Handler must be idempotent |
| Transactional produce | Exactly-once, but only Kafka-to-Kafka |

## The short version

Kafka gives you a durable, replayable, partition-ordered log. That is an
enormous amount. It does not give you global ordering, and it does not make
your database writes transactional with your consumption.[^1]

Most Kafka incidents I have seen were not Kafka failing. They were a service
assuming a guarantee one level stronger than the one it had.

[^1]: The outbox pattern is the usual answer here — write the event to your
    database in the same transaction as the state change, then relay it to
    Kafka separately. It trades a little latency for not lying to yourself.
