---
title: "Intro to Redis part 2"
displayDate: "2016-01-11"
summary: "An introduction to Redis, pt 2."
tags:
---
<small class="left">
{{ page.displayDate }}
</small>
<br><br>

##{{ page.title }}
{{ page.summary }}

---
Welcome back to my introduction to Redis! I've been using Redis on a daily basis for work ([Form.io](http://form.io/)),
and loving every minute of it. This is part 2 of my introduction to Redis, so feel free to read my 
[Intro to Redis part 1](/blog/intro-to-redis-part-1/) if you haven't yet.

<br>
In part 1, we scratched the surface with the fundamentals, today we're going to dive right in and explore `Hashes`! To
reiterate what I stated in [Part 1](/blog/intro-to-redis-part-1/), Redis has a multitude of uses, and what I demo is
by no means its limit, so I strongly encourage everyone to follow along in their terminals and explore!

<br>
`Note: All redis commands can be used in lowercase, but I'll stay consistent with the documentation and use uppercase 
for all the examples in this series.`

<br>

###Hashes
---
Hashes are key-value pairs that share a single key (Redis inception?) which can be visualized as a JSON Object:

<pre><code class="json">{
  "some-redis-key": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
</code></pre>

Each hash is stored using a key, which in turn has its own key/value pairs. You can create a hash with `HSET`, which
requires the hash to be used and an initial key/value pair. Additionally, we can get the value of a field using `HGET`,
and delete a field using `HDEL`.

<br>

*Note: If you want to delete the whole hash, it can be done by [deleting](http://redis.io/commands/del) the key itself.*

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HSET hash1 foo bar
(integer) 1
127.0.0.1:6379> HGET hash1 foo
"bar"
127.0.0.1:6379> HDEL hash1 foo
(integer) 1
127.0.0.1:6379> HGET hash1 foo
(nil)
127.0.0.1:6379> 
</code></pre>

Hashes also provide a way to set/get multiple values at once (without using transactions) with `HMSET` and `HMGET`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HMSET hash1 key1 value1 key2 value2
OK
127.0.0.1:6379> HGET hash1 key1
"value1"
127.0.0.1:6379> HGET hash1 key2
"value2"
127.0.0.1:6379> HMGET hash1 key1 key2
1) "value1"
2) "value2"
127.0.0.1:6379>  
</code></pre>

If you just need all the keys or all the values, or even the number of key/value pairs, you can use `HKEYS`, `HVALS`,
and `HLEN`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HKEYS hash1
1) "key1"
2) "key2"
127.0.0.1:6379> HVALS hash1
1) "value1"
2) "value2"
127.0.0.1:6379> HLEN hash1
(integer) 2
127.0.0.1:6379> 
</code></pre>

Now this is all fine an dandy, but how do you update the value of a specific field? Well that can be done by using
`HSET` *again*. Now, that could pose an issue... How does one save a field for the first time, rather than potentially 
overwriting pre-existing data? `HEXISTS` will allow you to see if a field exists, or even more intelligently, `HSETNX`
will only set a field *if* it does not already have a value.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HEXISTS hash1 key1
(integer) 1
127.0.0.1:6379> HSETNX hash1 key1 updatedValue1
(integer) 0
127.0.0.1:6379> HSETNX hash1 key3 value3
(integer) 1
127.0.0.1:6379> 
</code></pre>

Finally, Hashes support simple sum operations, both integer and float, with `HINCRBY` and `HINCRBYFLOAT`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HINCRBY hash1 num1 1
(integer) 1
127.0.0.1:6379> HINCRBY hash1 num1 1
(integer) 2
127.0.0.1:6379> HINCRBYFLOAT hash1 num2 1.00000001
"1.00000001"
127.0.0.1:6379> HINCRBYFLOAT hash1 num2 0.00003000
"1.00003001"
127.0.0.1:6379>
</code></pre>

###Examples
---

The trick to using Redis successfully is knowing what tools you have at your disposal. Deploying with the *correct*
implementation can really help with headaches down the road. There are situations where hashes are the best tool for 
the job, and hopefully I can help highlight some key differentiators.

<br>

Hashes in general are just empty containers that best correspond to objects. There is no hard limit on the number of
fields in a Hash (other than memory) so they can pretty much be used for anything. The primary use-case of Hashes is to
reduce long common key names to correspond to separate properties, for example, imagine using plain keys to store the
properties of a given user:

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SET user1:name zack
OK
127.0.0.1:6379> SET user1:twitter @zackurben
OK
127.0.0.1:6379> SET user1:password password
OK
127.0.0.1:6379> KEYS user1:*
1) "user1:name"
2) "user1:twitter"
3) "user1:password"
</code></pre>

The given example is wildly impractical because:

  1. It requires the use of `KEYS` to get the properties for user1, which runs in O(n) for the entire key space of
  Redis; RIP Server IO. You could additional use `SCAN` with a glob pattern, but again pretty impractical for
  identifying (and possibly updating) user properties. Can you say Transactions?
  2. The primary key is *duplicated* for each property of the user, which is terrible considering that RAM is the
  literal lifeblood of Redis.
  3. You cannot atomically read or delete all the keys at the same time, even with a glob pattern. First you need to use
  `KEYS` or `SCAN` to find the keys, and individually read or delete them with `GET` and `DEL`.
  *Note: `MGET` does not work with glob patterns.*

I can pretty much guarantee there is another n items to be added to the list of impracticalities, but I think I've made
my point; Enter Hashes.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HSET user1 name zack
(integer) 1
127.0.0.1:6379> HSET user1 twitter @zackurben
(integer) 1
127.0.0.1:6379> HSET user1 password password
(integer) 1
127.0.0.1:6379> HKEYS user1
1) "name"
2) "twitter"
3) "password"
127.0.0.1:6379> HVALS user1
1) "zack"
2) "@zackurben"
3) "password"
</code></pre>
