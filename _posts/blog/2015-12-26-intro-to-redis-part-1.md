---
title: "Intro to Redis part 1"
displayDate: "2015-12-26"
summary: "An introduction to Redis."
tags:
---
<small class="left">
{{ page.displayDate }}
</small>
<br><br>

##{{ page.title }}
{{ page.summary }}

---
I've recently rekindled my love for Redis through work, and thought it would be an acceptable topic for my first 
technical blog post. I'm currently using Redis for the [Form.io](http://form.io/) analytics system, and previously 
for a queueing system, but its elegance lures me for every project.

<br>
[Redis](http://redis.io/) is an in-memory data store with a multitude of uses. It is used by everyone from Coinbase to
Kickstarter to Alibaba, for more see [techstacks.io](http://techstacks.io/tech/redis). The general topic of Redis is
quite large, so in the first part of this series, I am going to generally cover: `Keys`, `Strings`, `Lists`, and 
`Transactions`. Feel free to follow along in your terminal and get your feet wet with Redis!

<br>
It should be noted that the [Redis Documentation](http://redis.io/commands) is terrific, and even shows asymptotic
time complexity (in big O) for each command, so you can judge whether or not a command is acceptable to use in your 
application.

<br>
`Note: All redis commands can be used in lowercase, but I'll stay consistent with the documentation and use uppercase
for all the examples in this series.`

<br>

###Installation
---
You can download the latest version of Redis [here](http://redis.io/download), and follow the installation directions.
When complete, start the `redis-server` in the background and then connect with the `redis-cli`.

<pre><code class="bash">$ redis-server
-- output condensed --

                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 3.0.4 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 75162
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                          

-- output condensed --
</code></pre>

<pre><code class="bash">$ redis-cli
127.0.0.1:6379>
</code></pre>


<br>

###Keys and Strings
---
Redis is a key value store, it can be visualized as a JSON object:
<pre><code class="json">{
  "hello": "world"
}
</code></pre>

You can easily create, read, type check, and delete keys with `SET`, `GET`, `TYPE` and `DEL` commands respectively. 

<pre><code class="bash">$ redis-cli
127.0.0.1:6379> SET hello world
OK
127.0.0.1:6379> GET hello
"world"
127.0.0.1:6379> TYPE hello
string
127.0.0.1:6379> DEL hello
(integer) 1
127.0.0.1:6379> GET hello
(nil)
127.0.0.1:6379> 
</code></pre>

Additionally, there are two forms of updates, one for the key and the other for the value: `RENAME` and `SET`

<pre><code class="bash">127.0.0.1:6379> SET hello world
OK
127.0.0.1:6379> RENAME hello foo
OK
127.0.0.1:6379> GET foo
"world"
127.0.0.1:6379> SET foo bar
OK
127.0.0.1:6379> GET foo
"bar"
127.0.0.1:6379>
</code></pre>

Redis also supports key expiration, but by default, keys don't have an expiration time. You can see if a key exists, and
when it expires with `EXISTS` and `TTL`, or add/remove an expiration time with `EXPIRE` and `PERSIST`.

<br>
`NOTE: Times are given in seconds, but there are commands for milliseconds.`

<pre><code class="bash">127.0.0.1:6379> SET hello world
OK
127.0.0.1:6379> EXISTS hello
(integer) 1
127.0.0.1:6379> EXPIRE hello 60
(integer) 1
127.0.0.1:6379> TTL hello
(integer) 56
127.0.0.1:6379> PERSIST hello
(integer) 1
127.0.0.1:6379> TTL hello
(integer) -1
127.0.0.1:6379> 
</code></pre>

<br>

###Lists
---
Lists are another commonly used storage type, which can be visualized as a JSON Array:

<pre><code class="json">{
  "hello": [
    "world1",
    "world2",
    "world3"
  ]
}
</code></pre>

A list can have items added, removed, trimmed, and retrieved with `LPUSH`, `LPOP`, `LTRIM`, and `LRANGE`.

<pre><code class="bash">127.0.0.1:6379> LPUSH hello world1
(integer) 1
127.0.0.1:6379> LPUSH hello world2
(integer) 2
127.0.0.1:6379> LPUSH hello world3
(integer) 3
127.0.0.1:6379> LRANGE hello 0 -1
1) "world3"
2) "world2"
3) "world1"
127.0.0.1:6379> LTRIM hello 0 1
OK
127.0.0.1:6379> LRANGE hello 0 -1
1) "world3"
2) "world2"
127.0.0.1:6379> LPOP hello
"world3"
127.0.0.1:6379> LRANGE hello 0 -1
1) "world2"
127.0.0.1:6379> 
</code></pre>

<br>
Notice how the previous operations are prepended with an L. Most of the list functions come in multiple variations that 
follow the given naming pattern:

<pre><code class="text"> &emsp; B* &nbsp; -> &nbsp; Blocking
 &emsp; L* &nbsp; -> &nbsp; Starting from the Left
 &emsp; R* &nbsp; -> &nbsp; Starting from the Right
 &emsp; *X &nbsp; -> &nbsp; If it exists
</code></pre>

<br>
I hope someone found this post helpful, and as always feel free to reach out to me on 
[Twitter]({{ site.twitter_profile }}) and suggest new topics for me to cover!

&minus; Zack

<br>
