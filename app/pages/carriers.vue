<template>
  <SimpleLayout
    title="Our Insurance Carrier Partners"
    intro="We partner with top-rated insurance carriers to provide you with competitive rates and reliable coverage. Our extensive network allows us to find the best policy for your unique needs and budget."
  >
    <ul
      role="list"
      class="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      <Card v-for="carrier in carriers" :key="carrier.name" as="li">
        <div
          class="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0"
        >
          <img
            :src="carrier.logo"
            :alt="carrier.name + ' logo'"
            class="h-8 w-8 object-contain"
            loading="eager"
            :key="carrier.name"
            @error="$event.target.src = $event.target.src"
          />
        </div>
        <h2
          class="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100"
        >
          <div class="relative">
            <div
              class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50"
            />
            <a
              :href="carrier.website"
              target="_blank"
              rel="noopener noreferrer"
              class="relative z-10 hover:text-teal-500 transition-colors duration-200"
            >
              <span
                class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"
              />
              {{ carrier.name }}
            </a>
          </div>
        </h2>
        <CardDescription>{{ carrier.description }}</CardDescription>
        <div class="mt-4">
          <h3 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Specialties:
          </h3>
          <ul class="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            <li v-for="specialty in carrier.specialties" :key="specialty">
              • {{ specialty }}
            </li>
          </ul>
        </div>
        <p
          class="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200"
        >
          <LinkIcon class="h-6 w-6 flex-none" />
          <span class="ml-2">Learn More</span>
        </p>
      </Card>
    </ul>

    <!-- Compliance Disclaimer -->
    <div
      class="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700/40 dark:bg-zinc-800/50"
    >
      <p class="text-sm text-zinc-600 dark:text-zinc-400">
        <strong>Disclaimer:</strong> Logos and trademarks are the property of
        their respective owners. Mowry Agency and Symmetry Financial Group are
        not owned by or directly affiliated with these carriers. We are
        independent agents authorized to sell insurance products from these
        companies.
      </p>
    </div>
  </SimpleLayout>
</template>

<script setup lang="ts">
import Card from '~/components/Card.vue';
import CardDescription from '~/components/CardDescription.vue';
import LinkIcon from '~/components/icons/LinkIcon.vue';
import SimpleLayout from '~/components/SimpleLayout.vue';

// Set page metadata
useSeoMeta({
	title: 'Insurance Carriers - Mowry Agency',
	description:
		'Discover our network of trusted insurance carrier partners. We work with top-rated companies to find you the best life insurance coverage at competitive rates.',
	ogTitle: 'Insurance Carriers - Mowry Agency',
	ogDescription:
		'Trusted insurance carrier partners with A-ratings and competitive rates for life insurance coverage.',
});

const carriers = [
	{
		name: 'American Amicable',
		description:
			'Specializing in affordable final expense and whole life insurance with simplified underwriting processes.',
		website: 'https://www.american-amicable.com',
		logo: '/images/carriers/american_amicable_logo.png',
		specialties: [
			'Final Expense Insurance',
			'Whole Life Insurance',
			'Simplified Issue',
		],
	},
	{
		name: 'Americo',
		description:
			'Over 130 years of experience providing life insurance and annuity products with competitive rates.',
		website: 'https://www.americo.com',
		logo: '/images/carriers/americo_logo.png',
		specialties: ['Term Life Insurance', 'Whole Life Insurance', 'Annuities'],
	},
	{
		name: 'Corebridge Financial',
		description:
			'Leading provider of retirement services and insurance solutions with strong financial ratings.',
		website: 'https://www.corebridge.com',
		logo: '/images/carriers/corebrige_logo.png',
		specialties: [
			'Universal Life Insurance',
			'Indexed Universal Life',
			'Retirement Planning',
		],
	},
	{
		name: 'F&G (Fidelity & Guaranty)',
		description:
			'Focuses on annuities and life insurance with innovative product designs and competitive pricing.',
		website: 'https://www.fglife.com',
		logo: '/images/carriers/f&g_logo.png',
		specialties: [
			'Indexed Universal Life',
			'Fixed Annuities',
			'Term Life Insurance',
		],
	},
	{
		name: 'Foresters Financial',
		description:
			'Mutual company offering life insurance and investment products with member benefits and community focus.',
		website: 'https://www.foresters.com',
		logo: '/images/carriers/foresters_logo.png',
		specialties: [
			'Whole Life Insurance',
			'Term Life Insurance',
			"Children's Insurance",
		],
	},
	{
		name: 'LGA by Banner Life',
		description:
			'Subsidiary of Legal & General America offering flexible life insurance solutions with competitive underwriting.',
		website: 'https://www.lgamerica.com',
		logo: '/images/carriers/legal_and_general_logo.png',
		specialties: [
			'Term Life Insurance',
			'Universal Life Insurance',
			'No-Exam Life Insurance',
		],
	},
	{
		name: 'Mutual of Omaha',
		description:
			'Fortune 500 company with over 110 years of experience in life insurance and financial services.',
		website: 'https://www.mutualofomaha.com',
		logo: '/images/carriers/mutal_of_omaha_logo.jpeg',
		specialties: [
			'Term Life Insurance',
			'Whole Life Insurance',
			'Final Expense Insurance',
		],
	},
	{
		name: 'SBLI (Savings Bank Life Insurance)',
		description:
			'Direct-to-consumer life insurance provider offering competitive rates and simplified purchasing.',
		website: 'https://www.sbli.com',
		logo: '/images/carriers/sbli_logo.webp',
		specialties: [
			'Term Life Insurance',
			'Whole Life Insurance',
			'No-Exam Policies',
		],
	},
	{
		name: 'United Home Life',
		description:
			'Family-owned insurance company specializing in final expense and simplified issue life insurance.',
		website: 'https://www.unitedhomelife.com',
		logo: '/images/carriers/united_home_life_logo.png',
		specialties: [
			'Final Expense Insurance',
			'Simplified Issue Life',
			'Burial Insurance',
		],
	},
	{
		name: 'Transamerica',
		description:
			'Major insurance and investment company offering a wide range of life insurance and retirement products.',
		website: 'https://www.transamerica.com',
		logo: '/images/carriers/transamerica-logo.png',
		specialties: [
			'Universal Life Insurance',
			'Term Life Insurance',
			'Variable Life Insurance',
		],
	},
	{
		name: 'American Equity',
		description:
			'Leading provider of fixed index annuities and life insurance with focus on retirement planning.',
		website: 'https://www.american-equity.com',
		logo: '/images/carriers/american-equity_logo.jpg',
		specialties: [
			'Fixed Index Annuities',
			'Indexed Universal Life',
			'Retirement Solutions',
		],
	},
	{
		name: 'Assurity Life Insurance',
		description:
			'Mutual company providing life insurance and disability income insurance with personalized service.',
		website: 'https://www.assurity.com',
		logo: '/images/carriers/assurity-logo.webp',
		specialties: [
			'Term Life Insurance',
			'Whole Life Insurance',
			'Disability Insurance',
		],
	},
	{
		name: 'Athene',
		description:
			'Leading retirement services company specializing in fixed annuities and retirement income solutions.',
		website: 'https://www.athene.com',
		logo: '/images/carriers/athene_logo.png',
		specialties: [
			'Fixed Annuities',
			'Fixed Index Annuities',
			'Retirement Income',
		],
	},
	{
		name: 'Gerber Life Insurance',
		description:
			'Specializes in affordable life insurance for children and families with simplified application processes.',
		website: 'https://www.gerberlife.com',
		logo: '/images/carriers/gerber_life_logo.jpg',
		specialties: [
			"Children's Life Insurance",
			'Whole Life Insurance',
			'Term Life Insurance',
		],
	},
	{
		name: 'John Hancock',
		description:
			'Major life insurance company offering innovative products including interactive policies with wellness programs.',
		website: 'https://www.johnhancock.com',
		logo: '/images/carriers/john_handcock_logo.jpg',
		specialties: [
			'Term Life Insurance',
			'Universal Life Insurance',
			'Wellness Programs',
		],
	},
	{
		name: 'Lafayette Life',
		description:
			'Regional insurance company providing personalized life insurance solutions with competitive rates.',
		website: 'https://www.lafayettelife.com',
		logo: '/images/carriers/lafayette_logo.png',
		specialties: [
			'Whole Life Insurance',
			'Term Life Insurance',
			'Final Expense Insurance',
		],
	},
	{
		name: 'Liberty Bankers',
		description:
			'Specialized in final expense and burial insurance with simplified underwriting and quick approval.',
		website: 'https://www.libertybankers.com',
		logo: '/images/carriers/liberty_bankers_logo.jpg',
		specialties: [
			'Final Expense Insurance',
			'Burial Insurance',
			'Simplified Issue',
		],
	},
	{
		name: 'Mutual Trust Life',
		description:
			'Regional insurance company focusing on affordable life insurance products for working families.',
		website: 'https://www.mutualtrustlife.com',
		logo: '/images/carriers/mutal_trust_logo.jpg',
		specialties: [
			'Term Life Insurance',
			'Whole Life Insurance',
			'Group Life Insurance',
		],
	},
	{
		name: 'National Life Group',
		description:
			'Mutual company with over 175 years of experience providing life insurance and annuity products.',
		website: 'https://www.nationallife.com',
		logo: '/images/carriers/national_life_group_logo.png',
		specialties: [
			'Universal Life Insurance',
			'Whole Life Insurance',
			'Annuities',
		],
	},
	{
		name: 'Royal Neighbors',
		description:
			'Fraternal benefit society providing life insurance with member benefits and community involvement.',
		website: 'https://www.royalneighbors.org',
		logo: '/images/carriers/royal_neighbors_logo.jpeg',
		specialties: [
			'Whole Life Insurance',
			'Term Life Insurance',
			'Member Benefits',
		],
	},
];
</script>
