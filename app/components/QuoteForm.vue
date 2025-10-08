<template>
  <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
    <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      <MailIcon class="h-6 w-6 flex-none" />
      <span class="ml-3">Get Your Free Life Insurance Quote</span>
    </h2>
    <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
      Ready to protect your family's future? Fill out the form below and we'll
      contact you within 24 hours with a personalized life insurance quote.
    </p>

    <form
      v-if="!hasFormSubmitted"
      @submit.prevent="onSubmit"
      class="mt-6 space-y-6"
    >
      <!-- Personal Information Section -->
      <div class="space-y-4">
        <h3
          class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Personal Information
        </h3>

        <!-- First and Last Name -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              First Name *
            </label>
            <p class="text-red-600 text-xs min-h-[1rem]">
              {{ firstNameError || '' }}
            </p>
            <input
              v-model="firstName"
              id="firstName"
              name="firstName"
              type="text"
              autocomplete="given-name"
              class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
              placeholder="John"
            />
          </div>
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Last Name *
            </label>
            <p class="text-red-600 text-xs min-h-[1rem]">{{ lastNameError || '' }}</p>
            <input
              v-model="lastName"
              id="lastName"
              name="lastName"
              type="text"
              autocomplete="family-name"
              class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
              placeholder="Doe"
            />
          </div>
        </div>

        <!-- Email and Phone -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email Address *
            </label>
            <p class="text-red-600 text-xs min-h-[1rem]">{{ emailError || '' }}</p>
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Phone Number *
            </label>
            <p class="text-red-600 text-xs min-h-[1rem]">{{ phoneError || '' }}</p>
            <input
              v-model="phone"
              id="phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <!-- Date of Birth -->
        <div>
          <label
            for="dateOfBirth"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Date of Birth *
          </label>
          <p class="text-red-600 text-xs min-h-[1rem]">
            {{ dateOfBirthError || '' }}
          </p>
          <input
            v-model="dateOfBirth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
          />
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Must be 18 years or older
          </p>
        </div>
      </div>

      <!-- Insurance Information Section -->
      <div class="space-y-4">
        <h3
          class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Insurance Information
        </h3>

        <!-- Coverage Type -->
        <div>
          <label
            for="coverageType"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Type of Coverage *
          </label>
          <p class="text-red-600 text-xs min-h-[1rem]">
            {{ coverageTypeError || '' }}
          </p>
          <select
            v-model="coverageType"
            id="coverageType"
            name="coverageType"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
          >
            <option value="">Select coverage type</option>
            <option value="term-life">Term Life Insurance</option>
            <option value="whole-life">Whole Life Insurance</option>
            <option value="iul">Indexed Universal Life (IUL)</option>
            <option value="not-sure">Not Sure / Need Guidance</option>
          </select>
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Don't worry if you're not sure - we'll help you choose
          </p>
        </div>
      </div>

      <!-- Health Information Section -->
      <div class="space-y-4">
        <h3
          class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Health Information
        </h3>

        <!-- Health Conditions -->
        <div>
          <label
            for="healthConditions"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Current Health Conditions *
          </label>
          <p class="text-red-600 text-xs min-h-[1rem]">
            {{ healthConditionsError || '' }}
          </p>
          <textarea
            v-model="healthConditions"
            id="healthConditions"
            name="healthConditions"
            rows="3"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
            placeholder="Please describe any current health conditions, chronic illnesses, or ongoing medical treatments. If you're in good health, simply write 'None' or 'Good health'."
          />
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            This helps us find the best rates for your situation
          </p>
        </div>

        <!-- Current Medications -->
        <div>
          <label
            for="medications"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Current Medications *
          </label>
          <p class="text-red-600 text-xs min-h-[1rem]">
            {{ medicationsError || '' }}
          </p>
          <textarea
            v-model="medications"
            id="medications"
            name="medications"
            rows="3"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
            placeholder="Please list all current medications including dosages if known. If none, please write 'None'."
          />
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Include prescription medications, over-the-counter drugs, and
            supplements
          </p>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="space-y-4">
        <h3
          class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Additional Information
        </h3>

        <!-- Additional Message -->
        <div>
          <label
            for="message"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Additional Information (Optional)
          </label>
          <p class="text-red-600 text-xs min-h-[1rem]">{{ messageError || '' }}</p>
          <textarea
            v-model="message"
            id="message"
            name="message"
            rows="3"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
            placeholder="Tell us about your family situation, coverage goals, budget considerations, or any questions you have about life insurance."
          />
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Help us better understand your needs and goals
          </p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <Button
          v-if="!formSubmittingInProcess"
          :disabled="formSubmittingInProcess"
          type="submit"
          variant="primary"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700"
        >
          Get My Free Quote
        </Button>
        <div v-else class="flex justify-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
        </div>
      </div>
    </form>

    <!-- Success Message -->
    <div v-else class="mt-6">
      <div class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
              Quote Request Submitted Successfully!
            </h3>
            <div class="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>
                Thank you for your interest in life insurance! We'll review your
                information and contact you within 24 hours with personalized
                coverage options and competitive rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import Button from '~/components/Button.vue';
import MailIcon from '~/components/icons/MailIcon.vue';

const formSubmittingInProcess = ref(false);
const hasFormSubmitted = ref(false);

const validations = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup.string().required('Phone number is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  coverageType: yup.string().required('Please select a coverage type'),
  healthConditions: yup
    .string()
    .required('Please provide health conditions information'),
  medications: yup.string().required('Please provide medications information'),
  message: yup.string(),
});

const { handleSubmit } = useForm({
  validationSchema: validations,
});

const { value: firstName, errorMessage: firstNameError } =
  useField<string>('firstName');
const { value: lastName, errorMessage: lastNameError } =
  useField<string>('lastName');
const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: phone, errorMessage: phoneError } = useField<string>('phone');
const { value: dateOfBirth, errorMessage: dateOfBirthError } =
  useField<string>('dateOfBirth');
const { value: coverageType, errorMessage: coverageTypeError } =
  useField<string>('coverageType');
const { value: healthConditions, errorMessage: healthConditionsError } =
  useField<string>('healthConditions');
const { value: medications, errorMessage: medicationsError } =
  useField<string>('medications');
const { value: message, errorMessage: messageError } =
  useField<string>('message');

const onSubmit = handleSubmit(async (formData) => {
  formSubmittingInProcess.value = true;

  try {
    await $fetch('/api/quote', {
      method: 'POST',
      body: formData,
    });
    hasFormSubmitted.value = true;
  } catch (error) {
    console.error('Form submission error:', error);
  } finally {
    formSubmittingInProcess.value = false;
  }
});
</script>
