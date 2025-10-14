<template>
  <footer class="mt-32 flex-none">
    <Container>
      <div class="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
        <div class="space-y-6">
          <!-- Navigation Links -->
          <div
            class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            <NuxtLink
              href="/about"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >About</NuxtLink
            >
            <NuxtLink
              href="/carriers"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Carriers</NuxtLink
            >
            <NuxtLink
              href="/quote"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Get Quote</NuxtLink
            >
            <NuxtLink
              href="/join-us"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Join Us</NuxtLink
            >
          </div>

          <!-- Copyright and Legal Information -->
          <div
            class="text-center space-y-3 text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed"
          >
            <p class="font-medium">
              © 2025 Mowry Agency. All rights reserved.
            </p>
            <p>
              Mowry Agency is owned and operated by Mowry Digital Enterprise
              LLC.
            </p>
            <p>
              Licensed to sell life insurance in the following states: AL
              (#3003564119), AR (#16357772), AZ (#16357772), CA (#0187103), CO
              (#446511), CT (#16357772), FL (#G223894), GA (#3784798), IA
              (#16357772), ID (#16357772), IL (#16357772), IN (#4085378), MA
              (#1637772), MD (#3003518353), MI (#16357772), MN (#40260160), MO
              (#3003518359), MT (#100136632), NC (#16357772), NE (#16357772), NJ
              (#3003561084), NM (#16357772), NV (#787094), OH (#1645455), PA
              (#1234889), SC (#16357772), SD (#40174465), TN (#3003536895), TX
              (#3302151), UT (#1070279), VA (#1493977), WA (#792132), WI
              (#16357772), WY (#229623).
            </p>
            <p>National Producer Number (NPN): 16357772</p>
            <p>
              Mowry Agency is an independent insurance agency and is not
              affiliated with or endorsed by any government agency.
            </p>
            <p>
              For inquiries, contact
              <a
                :href="`mailto:${agencyEmail}`"
                class="text-teal-500 hover:text-teal-400 transition"
                >{{ agencyEmail }}</a
              >
              or call
              <a
                :href="`tel:+1${cleanPhone}`"
                class="text-teal-500 hover:text-teal-400 transition"
                >{{ agencyPhone }}</a
              >.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </footer>
</template>

<script setup lang="ts">
import Container from '~/components/Container.vue';

const config = useRuntimeConfig();
const agencyEmail = config.public.agencyEmail as string;
const agencyPhone = config.public.agencyPhone as string;
const cleanPhone = agencyPhone.replace(/[^\d]/g, '');
</script>
