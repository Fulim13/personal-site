---
title: Postgres Isolation Level Explained
pubDate: 2026-09-11
featured: true
unlisted: false
tags:
  - postgres
  - database
description: >-
  Learn how PostgreSQL transaction isolation levels prevent dirty reads,
  non-repeatable reads, phantom reads, lost updates, and serialization
  anomalies.
---

In this article, I will use PostgreSQL with `Docker` and `pgcli` to explain isolation levels in PostgreSQL.

## Prerequisites
1. Install [Docker](https://docs.docker.com/desktop/setup/install/mac-install/)
2. Install [pgcli](https://www.pgcli.com/install)


## Setup
Create a temporary database with Docker
```sh
docker run --rm \
  --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=app \
  -p 5432:5432 \
  postgres:18
```

Connect with pgcli
```sh
pgcli postgresql://postgres:postgres@localhost:5432/app
```

Create `shows` table
```sql
CREATE TABLE shows (
    id BIGSERIAL PRIMARY KEY,
    show_name TEXT NOT NULL,
    available_seat INT NOT NULL DEFAULT 0,
    status VARCHAR(255) NOT NULL
);
```

Insert data
```sql
INSERT INTO shows (show_name, available_seat, status)
VALUES
    ('Taylor Swift Concert', 1, 'inactive'),
    ('Football Final', 1, 'inactive'),
    ('Movie Premiere', 1, 'active');
```


## Phenomena
#### Dirty Read
**Concept**: A transaction is allowed to read uncommitted changes made by another transaction.
![](assets/postgres-isolation-level-explained/file-20260912000828432.png)

> A dirty read cannot be shown in a Postgres example because dirty reads are not allowed in Postgres.


#### Non-Repeatable Read
**Concept**: One of the rows you've queried at different stages of a transaction may be different because the rows may be updated by other transactions.
![](assets/postgres-isolation-level-explained/file-20260912013045081.png)

![](assets/postgres-isolation-level-explained/file-20260912015813423.png)


#### Phantom Read
**Concept**: The records you've queried at different stages of a transaction may be different because rows may be added or removed by other transactions.
![](assets/postgres-isolation-level-explained/file-20260912015411560.png)

![](assets/postgres-isolation-level-explained/file-20260912020202274.png)


#### Lost Update
**Concept**: Occurs when two transactions read the same data and try to update it with different values, and one of the updates is lost.
![](assets/postgres-isolation-level-explained/file-20260912020657541.png)

![](assets/postgres-isolation-level-explained/file-20260912021532834.png)


#### Serialization Anomaly
**Concept**: The result of successfully committing a group of transactions is inconsistent with all possible orderings of running those transactions one at a time.

> We will explain this more clearly in Errors for Serialization Anomalies.


## Isolation Level
| Isolation Level     |  Dirty Read | Non-repeatable Read | Phantom Read |   Lost Update | Serialization Anomaly |
| ------------------- | ----------: | ------------------: | -----------: | ------------: | --------------------: |
| **READ COMMITTED**  | ✅ Prevented |        ❌ Can happen | ❌ Can happen | ⚠️ Can happen |          ❌ Can happen |
| **REPEATABLE READ** | ✅ Prevented |         ✅ Prevented | ✅ Prevented* |  ✅ Prevented* |          ❌ Can happen |
| **SERIALIZABLE**    | ✅ Prevented |         ✅ Prevented |  ✅ Prevented |  ✅ Prevented* |           ✅ Prevented |


## Errors in Repeatable Read and Serializable
#### Repeatable Read Error Example:
>Repeatable read ERROR: could not serialize access due to concurrent update


![](assets/postgres-isolation-level-explained/file-20260912021635576.png)

When both transactions update the same row of the data, the second transaction will fail.


#### Serializable Error Example:
Isolation Level: Repeatable Read
![](assets/postgres-isolation-level-explained/file-20260912023922773.png)

Given scenario
```
inactive
inactive
active
active
```

In Transaction 1, we update those inactive rows to active.
In Transaction 2, we update those active rows to inactive.

Since both transactions do not touch the same rows, both can be committed, and as a result, the statuses are flipped.
```
active
active
inactive
inactive
```


Isolation Level: Serializable
>Serializable ERROR: could not serialize access due to read/write dependencies among transactions


![](assets/postgres-isolation-level-explained/file-20260912022846603.png)

Given scenario
```
inactive
inactive
active
active
```

In Transaction 1, we update those inactive rows to active.
In Transaction 2, we update those active rows to inactive.

However, Postgres at the Serializable isolation level will detect a potential serial path.

The potential serial path:
1. **Serial Order Transaction 1 then Transaction 2:**
	1. Transaction 1 would convert all inactive rows to active rows → the table becomes all active, then T2 would update all active rows to inactive → final state: all inactive.
2. **Serial Order Transaction 2 then Transaction 1:**
	1. Transaction 2 would convert all active rows to inactive rows → the table becomes all inactive, then T1 would update all inactive rows to active → final state: all active.

However, in this example, the result will contain two active rows and two inactive rows, which does not match either possible final state—all inactive or all active. Therefore, the second transaction is not allowed and must be retried in a new transaction.


# Reference
1. https://mkdev.me/posts/transaction-isolation-levels-with-postgresql-as-an-example
2. https://medium.com/@moali314/repeatable-read-vs-serializable-946d15ef091c
