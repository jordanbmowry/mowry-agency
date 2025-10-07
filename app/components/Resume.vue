<template>
  <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
    <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      <BriefcaseIcon class="h-6 w-6 flex-none" />
      <span class="ml-3">Work</span>
    </h2>
    <ol class="mt-6 space-y-4">
      <Role v-for="(role, roleIndex) in resume" :key="roleIndex" :role="role" />
    </ol>
    <Button href="#" variant="secondary" class="group mt-6 w-full">
      Download CV
      <ArrowDownIcon
        class="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50"
      />
    </Button>
  </div>
</template>

<script setup lang="ts">
import BriefcaseIcon from './icons/BriefcaseIcon.vue';
import ArrowDownIcon from './icons/ArrowDownIcon.vue';
import Role from './Role.vue';
import Button from './Button.vue';

const resume = [
  {
    company: 'Planetaria',
    title: 'CEO',
    logo: '/images/logos/planetaria.svg',
    start: '2019',
    end: {
      label: 'Present',
      dateTime: new Date().getFullYear().toString(),
    },
  },
  {
    company: 'Airbnb',
    title: 'Product Designer',
    logo: '/images/logos/airbnb.svg',
    start: '2014',
    end: '2019',
  },
  {
    company: 'Facebook',
    title: 'iOS Software Engineer',
    logo: '/images/logos/facebook.svg',
    start: '2011',
    end: '2014',
  },
  {
    company: 'Starbucks',
    title: 'Shift Supervisor',
    logo: '/images/logos/starbucks.svg',
    start: '2008',
    end: '2011',
  },
];
</script>
