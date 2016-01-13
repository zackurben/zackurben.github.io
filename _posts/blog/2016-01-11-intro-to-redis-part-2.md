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
In part 1, we scratched the surface with the fundamentals, today we're going to dive right in and explore a bit! To 
reiterate what I stated in [Part 1](/blog/intro-to-redis-part-1/), I am going to generally cover the given topics, and 
strongly encourage everyone to follow along in their terminals! Today I will cover: `Hashes`, `Sets`, and `Pub/Sub`.

<br>
`Note: All redis commands can be used in lowercase, but I'll stay consistent with the documentation and use uppercase 
for all the examples in this series.`

<br>

###Hashes
---
Hashes are key-value maps (Redis inception?) which can be visualized as a JSON Object:

<pre><code class="json">{
  "hello": "world"
}
</code></pre>

Each hash is stored using a key, which in turn has its own key/value pairs. You can create a hash with `HSET`, which
requires the hash to be used and an initial key/value pair. Additionally, we can get the value of a field using `HGET`,
and delete a field using `HDEL`.

<br>

*Note: If you want to delete the whole hash, it can be done by [deleting](http://redis.io/commands/del) the key itself.*

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HSET myFirstHash foo bar
(integer) 1
127.0.0.1:6379> HGET myFirstHash foo
"bar"
127.0.0.1:6379> HDEL myFirstHash foo
(integer) 1
127.0.0.1:6379> HGET myFirstHash foo
(nil)
127.0.0.1:6379> 
</code></pre>

Hashes also provide a way for multi set and get with `HMSET` and `HMGET`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HMSET myFirstHash key1 value1 key2 value2
OK
127.0.0.1:6379> HGET myFirstHash key1
"value1"
127.0.0.1:6379> HGET myFirstHash key2
"value2"
127.0.0.1:6379> HMGET myFirstHash key1 key2
1) "value1"
2) "value2"
127.0.0.1:6379>  
</code></pre>

If you just need all the keys or all the values, or even the number of key/value pairs, you can use `HKEYS`, `HVALS`,
and `HLEN`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HKEYS myFirstHash
1) "key1"
2) "key2"
127.0.0.1:6379> HVALS myFirstHash
1) "value1"
2) "value2"
127.0.0.1:6379> HLEN myFirstHash
(integer) 2
127.0.0.1:6379> 
</code></pre>

Now this is all fine an dandy, but how do you update the value of a specific field? Well that can be done by using
`HSET` *again*. Now, that could pose an issue... How does one save a field for the first time, rather than potentially 
overwriting pre-existing data? `HEXISTS` will allow you to see if a field exists, or even more intelligently, `HSETNX`
will only set a field *if* it does not already have a value.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> HEXISTS myFirstHash key1
(integer) 1
127.0.0.1:6379> HSETNX myFirstHash key1 updatedValue1
(integer) 0
127.0.0.1:6379> HSETNX myFirstHash key3 value3
(integer) 1
127.0.0.1:6379> 
</code></pre>

Finally, Hashes support simple sum operations, both integer and float, with `HINCRBY` and `HINCRBYFLOAT`.

<pre><code class="bash">$ redis-cli 
</code></pre>
