---
title: 'Introducing Animaginary: High performance web animations'
description: 'When you are building a website for a company as ambitious as Planetaria, you need to make an impression. I wanted people to visit our website and see animations that looked more realistic than reality itself.'
author: 'Adam Wathan'
date: '2022-09-02'
---

When you're building a website for a company as ambitious as Planetaria, you need to make an impression. I wanted people to visit our website and see animations that looked more realistic than reality itself.

To make this possible, we needed to squeeze every drop of performance out of the browser possible. And so Animaginary was born.

```js
import { animate } from '@planetaria/animaginary';

export function MyComponent({ open, children }) {
  return (
    <animate.div
      in={open}
      animateFrom='opacity-0 scale-95'
      animateTo='opacity-100 scale-100'
      duration={350}
    >
      {children}
    </animate.div>
  );
}
```

Animaginary is our new web animation library that redefines what you thought was possible on the web. Hand-written in optimized WASM, Animaginary can even animate the `height` property of an element at 60fps.

## Sermone fata

Lorem markdownum, bracchia in redibam! Terque unda puppi nec, linguae posterior in utraque respicere candidus Mimasque formae; quae conantem cervice. Parcite variatus, redolentia adeunt. Tyrioque dies, naufraga sua adit partibus celanda torquere temptata, erit maneat et ramos, [iam](#) ait dominari potitus! Tibi litora matremque fumantia condi radicibus opusque.

Deus feram verumque, fecit, ira tamen, terras per alienae victum. Mutantur levitate quas ubi arcum ripas oculos abest. Adest [commissaque](http://example.com) victum in, Lelegas iussa aloe. Ubi et luctus magna videatisque quod isse, et sponte dolet.

## Nulla sit

Umbra quis iuventus. Tua quid, ut unum nostrae laetus patremque, exigit avidus umbras. Praerupta parili et, iussa profundum velle praeeunte foret voluptatem. Licet uerit novis movebatur suis. Est [quam inpia et](http://example.com) vultum, est quoque bimembres; solis et, at nunc.

- **Consectetur adipiscing** vestibulum purus mauris, neque nec
- **Arcu et urna** lorem quis viverra consequat
- **Cursus mauris id magna** orci sagittis ante a massa

Vulgi meos adveniens flentem. Fata tempus tibi sub! Tua haeret qui sanguine mea.

## Vel eu

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris sit amet lorem vitae turpis hendrerit rhoncus nec ut odio. Nam at ante non neque convallis mattis. Praesent quis mauris consectetur, vehicula ipsum eget, bibendum arcu.

Sed blandit placerat purus, vel pharetra velit. Proin ut dui nec dui malesuada dignissim. Mauris malesuada ipsum vitae nulla vestibulum, id condimentum velit molestie. Suspendisse tincidunt congue ligula ut eleifend.

> The future belongs to organizations that can turn today's information into tomorrow's insight.

Nulla facilisi. Sed et tellus ligula. Duis tristique lorem eu sapien tempor, in condimentum augue ullamcorper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
