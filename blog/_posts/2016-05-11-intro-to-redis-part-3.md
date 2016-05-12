---
title: "Intro to Redis part 3"
displayDate: "2016-05-11"
summary: "An introduction to Redis, pt 3: An exploration of Sets."
tags:
---
<small class="left">
{{ page.displayDate }}
</small>
<br><br>

## {{ page.title }}
{{ page.summary }}

---
Welcome back to my introduction to Redis! This is part 3 of my introduction to Redis, so feel free to read my
[Intro to Redis part 1](/blog/intro-to-redis-part-1/) and [Intro to Redis part 2](/blog/intro-to-redis-part-2/) if you
haven't yet.

<br>
So far, we have scratched the surface with the fundamentals and hashes, today we're going to play with `Sets`! To
reiterate what I stated in my previous articles, Redis has a multitude of uses, and what I demo is by no means its
limit, so I strongly encourage everyone to follow along and deviate from this post as you see fit!

<br>
`Note: All Redis commands can be used in lowercase, but I'll stay consistent with the documentation and use uppercase
for all the examples in this series.`

<br>

### Sets
Sets in Redis are modeled after Mathematical sets and present a highly useful data structure. You can create a set by
adding a member(s) to a key using `SADD`, and check the contents of a set with `SMEMBERS`; remember, sets can only
contain unique members, of which you can count with `SCARD`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SADD set1 cat
(integer) 1
127.0.0.1:6379> SADD set1 dog
(integer) 1
127.0.0.1:6379> SADD set1 bird
(integer) 1
127.0.0.1:6379> SMEMBERS set1
1) "dog"
2) "bird"
3) "cat"
127.0.0.1:6379> SADD set1 cat
(integer) 0
127.0.0.1:6379> SMEMBERS set1
1) "dog"
2) "bird"
3) "cat"
127.0.0.1:6379> SCARD set1
(integer) 3
127.0.0.1:6379>
</code></pre>

It should be noted that the return value for a duplicate entry is 0, but the return value for `SADD` is the number of
successful additions. Not to be confused with whether or not the operation was a success or failure. Below is an
example for when a duplicate is not added but the result is true, that is because 2 operations were queued, one was
successful (1) and the other failed (0), thus it returned 1. If both were successful, then 2 would have been returned.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SADD set1 cat fish
(integer) 1
127.0.0.1:6379> SMEMBERS set1
1) "fish"
2) "dog"
3) "bird"
4) "cat"
127.0.0.1:6379>
</code></pre>

The real power of sets comes when you have more than one set. Lets assume that we want to check the animals at two
different zoos. We can rename (lazy copy) our demo set (set1) to be zoo1 using `SUNIONSTORE`.

<br>
We're lazy, so were going to union (add) our previous set with a null (empty) set, so the resulting operation will be
a lazy copy, leaving us with two sets of identical contents.

<br>
*Note: SUNION is also available if you don't want to store the results.*

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SUNIONSTORE zoo1 set1
(integer) 4
127.0.0.1:6379> SMEMBERS zoo1
1) "dog"
2) "fish"
3) "cat"
4) "bird"
127.0.0.1:6379>
</code></pre>

Just to prove the sets are identical, we can do a `SDIFF` (NAND) and `SINTER` (AND) on each of our sets, resulting in
the empty set and our actual set respectively.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SDIFF zoo1 set1
(empty list or set)
127.0.0.1:6379> SDIFF set1 zoo1
(empty list or set)
127.0.0.1:6379> SINTER zoo1 set1
1) "dog"
2) "fish"
3) "cat"
4) "bird"
127.0.0.1:6379>
</code></pre>

To show the power of `SDIFF`, let's assume another Zoo pops up in town, we can see the difference in animals, and store
them using `SDIFFSTORE`. Likewise, we can see what animals are in both using `SINTER`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SADD zoo2 cat dog hippo monkey snake
(integer) 5
127.0.0.1:6379> SDIFF zoo1 zoo2
1) "fish"
2) "bird"
127.0.0.1:6379> SDIFF zoo2 zoo1
1) "snake"
2) "monkey"
3) "hippo"
127.0.0.1:6379> SINTER zoo1 zoo2
1) "dog"
2) "cat"
127.0.0.1:6379>
</code></pre>

Note how the `SDIFF` is different for each key ordering. The `SDIFF` essentially shows what is unique to the first set
when compared with each of the following sets.

<br>
Lets imagine that our second zoo is hemorrhaging money with its 5 animals, and they need to cut costs. We can remove
set members with `SREM` if we know what we want to remove, or `SPOP` if we just want to remove a random member.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SMEMBERS zoo2
1) "hippo"
2) "dog"
3) "snake"
4) "cat"
5) "monkey"1
127.0.0.1:6379> SREM zoo2 hippo
(integer) 1
127.0.0.1:6379> SPOP zoo2
"monkey"
127.0.0.1:6379> SMEMBERS zoo2
1) "dog"
2) "snake"
3) "cat"
127.0.0.1:6379>
</code></pre>

Now let's imagine zoo1 is feeling the burn with 4 animals, but zoo2 is making the big bucks, and looking to re-expand.
We can pick a random animal from the set using `SRANDMEMBER`, then check for a set member with `SISMEMBER`, and move
members between sets with `SMOVE`.

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SMEMBERS zoo1
1) "dog"
2) "fish"
3) "cat"
4) "bird"
127.0.0.1:6379> SMEMBERS zoo2
1) "dog"
2) "snake"
3) "cat"
127.0.0.1:6379> SRANDMEMBER zoo1
"bird"
127.0.0.1:6379> SISMEMBER zoo2 bird
(integer) 0
127.0.0.1:6379> SMOVE zoo1 zoo2 bird
(integer) 1
127.0.0.1:6379> SMEMBERS zoo1
1) "dog"
2) "fish"
3) "cat"
127.0.0.1:6379> SMEMBERS zoo2
1) "dog"
2) "snake"
3) "bird"
4) "cat"
127.0.0.1:6379>
</code></pre>

Forgive the animal/zoo references, it happened to be a better story than reading pure Redis documentation, yeah?
<br>
<br>

### Examples
If we want to look at the power of Redis sets with real world examples, let's consider the following: We have an
E-commerce website, and want to track the visitors each month.


  - Using a set, we can log each visitor to a monthly, e.g. `SADD 1/1/16 192.168.0.1`
  - At the end of each day we can see unique daily visitors by `SCARD 1/1/16`
  - At the end of each month we can see unique monthly visitors by `SUNIONSTORE jan2016 1/1/16 ... 1/31/16` &emsp; and
    then `SCARD jan2016`

<br>
<br>
Or, alternatively, If you wanted to give away 3 prizes to 5 people:

  - `SADD pool person1 ... person5`
  - `SPOP pool` &emsp; 3 times, to ensure there was no duplicate prizes given out.

<br>
<br>
Or, you're lazy and want to play Rock, Paper, Scissors..

  - `SADD rps Rock Paper Scissors`
  - `SRANDMEMBER rps` &emsp; then... Up-Arrow + Enter

<br>
<br>

### Conclusion
---
As stated earlier, the aim of this post was to explore the `Set` data type and understand its use cases. Sets are great
when dealing with unique items, and can make calculating the difference between multiple collections of data a breeze.

<br>
I hope someone found this post helpful, and as always feel free to reach out to me on
[Twitter]({{ site.twitter_profile }}) and suggest new topics for me to cover!

&minus; Zack

<br>
P.S. - If you were wondering why I randomly took a hiatus from posting, I was getting married!

<br>
