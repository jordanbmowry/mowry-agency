<template>
  <footer class="mt-32 flex-none">
    <Container>
      <div class="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
        <div class="space-y-8">
          <!-- Contact Information Section -->
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left"
          >
            <!-- Phone -->
            <div
              class="flex flex-col md:flex-row items-center md:items-start gap-3"
            >
              <div
                class="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-lg"
              >
                <Icon
                  name="heroicons:phone"
                  class="w-5 h-5 text-teal-600 dark:text-teal-400"
                />
              </div>
              <div class="flex-1">
                <h3
                  class="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1"
                >
                  Phone
                </h3>
                <a
                  :href="`tel:+1${cleanPhone}`"
                  class="text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition"
                >
                  {{ agencyPhone }}
                </a>
              </div>
            </div>

            <!-- Email -->
            <div
              class="flex flex-col md:flex-row items-center md:items-start gap-3"
            >
              <div
                class="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-lg"
              >
                <Icon
                  name="heroicons:envelope"
                  class="w-5 h-5 text-teal-600 dark:text-teal-400"
                />
              </div>
              <div class="flex-1">
                <h3
                  class="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1"
                >
                  Email
                </h3>
                <a
                  :href="`mailto:${agencyEmail}`"
                  class="text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition break-all"
                >
                  {{ agencyEmail }}
                </a>
              </div>
            </div>

            <!-- Address -->
            <div
              class="flex flex-col md:flex-row items-center md:items-start gap-3"
            >
              <div
                class="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-lg"
              >
                <Icon
                  name="heroicons:map-pin"
                  class="w-5 h-5 text-teal-600 dark:text-teal-400"
                />
              </div>
              <div class="flex-1">
                <h3
                  class="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1"
                >
                  Address
                </h3>
                <address
                  class="text-sm text-zinc-600 dark:text-zinc-400 not-italic leading-relaxed"
                >
                  {{ agencyAddress }}
                </address>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div
            class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-zinc-800 dark:text-zinc-200"
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
            <NuxtLink
              href="/privacy-policy"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Privacy Policy</NuxtLink
            >
            <NuxtLink
              href="/terms-of-service"
              class="transition hover:text-teal-500 dark:hover:text-teal-400"
              >Terms of Service</NuxtLink
            >
          </div>

          <!-- Copyright and Legal Information -->
          <div
            class="text-center space-y-4 text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed"
          >
            <div class="border-t border-zinc-100 dark:border-zinc-700/40 pt-6">
              <p class="font-medium text-sm mb-3">
                © 2025 Mowry Agency. All rights reserved.
              </p>
              <p class="mb-3">
                Mowry Agency is owned and operated by Mowry Digital Enterprise
                LLC.
              </p>

              <!-- License Information -->
              <details class="group">
                <summary
                  class="cursor-pointer text-teal-500 hover:text-teal-400 transition mb-2 inline-flex items-center gap-1"
                >
                  <span>Licensed Insurance States</span>
                  <Icon
                    name="heroicons:chevron-down"
                    class="w-4 h-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div
                  class="text-left max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 mt-2"
                >
                  <p class="mb-3 font-medium text-zinc-600 dark:text-zinc-300">
                    Licensed to sell life insurance in the following states:
                  </p>
                  <div
                    class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs"
                  >
                    <span>AL (#3003564119)</span>
                    <span>AR (#16357772)</span>
                    <span>AZ (#16357772)</span>
                    <span>CA (#0187103)</span>
                    <span>CO (#446511)</span>
                    <span>CT (#16357772)</span>
                    <span>FL (#G223894)</span>
                    <span>GA (#3784798)</span>
                    <span>IA (#16357772)</span>
                    <span>ID (#16357772)</span>
                    <span>IL (#16357772)</span>
                    <span>IN (#4085378)</span>
                    <span>MA (#1637772)</span>
                    <span>MD (#3003518353)</span>
                    <span>MI (#16357772)</span>
                    <span>MN (#40260160)</span>
                    <span>MO (#3003518359)</span>
                    <span>MT (#100136632)</span>
                    <span>NC (#16357772)</span>
                    <span>NE (#16357772)</span>
                    <span>NJ (#3003561084)</span>
                    <span>NM (#16357772)</span>
                    <span>NV (#787094)</span>
                    <span>OH (#1645455)</span>
                    <span>PA (#1234889)</span>
                    <span>SC (#16357772)</span>
                    <span>SD (#40174465)</span>
                    <span>TN (#3003536895)</span>
                    <span>TX (#3302151)</span>
                    <span>UT (#1070279)</span>
                    <span>VA (#1493977)</span>
                    <span>WA (#792132)</span>
                    <span>WI (#16357772)</span>
                    <span>WY (#229623)</span>
                  </div>
                </div>
              </details>

              <div class="space-y-2 mt-4">
                <p><strong>Licensed Agent:</strong> Jordan Mowry</p>
                <p><strong>National Producer Number (NPN):</strong> 16357772</p>
                <p>
                  Mowry Agency is an independent insurance agency and is not
                  affiliated with or endorsed by any government agency.
                </p>
              </div>
            </div>
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
const agencyAddress = config.public.agencyAddress as string;
const cleanPhone = agencyPhone.replace(/[^\d]/g, '');
</script>
