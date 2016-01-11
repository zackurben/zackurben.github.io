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
In part 1, we scratched the surface, today we will submerge ourselves. To reiterate what I stated in 
[Part 1](/blog/intro-to-redis-part-1/), I am going to generally cover the given topics, and strongly encourage everyone
to follow along in their terminals! Today I will cover: `Hashes`, `Sets`, and `Pub/Sub`.

<br>
`Note: All redis commands can be used in lowercase, but I'll stay consistent with the documentation and use uppercase 
for all the examples in this series.`

<br>

###Hashes
Hashes are key-value maps (Redis inception?) which can be visualized as a JSON Object:

<pre><code class="json">{
  "hello": "world"
}
</code></pre>
