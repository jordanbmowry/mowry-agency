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

    <form v-if="!submitted" @submit.prevent="onSubmit" class="mt-6 space-y-6">
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
            <p
              v-if="firstNameError"
              class="text-xs text-red-600 dark:text-red-400"
            >
              {{ firstNameError }}
            </p>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              required
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
            <p
              v-if="lastNameError"
              class="text-xs text-red-600 dark:text-red-400"
            >
              {{ lastNameError }}
            </p>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              required
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
            <p v-if="emailError" class="text-xs text-red-600 dark:text-red-400">
              {{ emailError }}
            </p>
            <input
              id="email"
              v-model="email"
              type="email"
              required
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
            <p v-if="phoneError" class="text-xs text-red-600 dark:text-red-400">
              {{ phoneError }}
            </p>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              required
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
          <p
            v-if="dateOfBirthError"
            class="text-xs text-red-600 dark:text-red-400"
          >
            {{ dateOfBirthError }}
          </p>
          <input
            id="dateOfBirth"
            v-model="dateOfBirth"
            type="date"
            required
            :max="maxDate"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
          />
          <p
            v-if="!dateOfBirthError"
            class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
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
          <p
            v-if="coverageTypeError"
            class="text-xs text-red-600 dark:text-red-400"
          >
            {{ coverageTypeError }}
          </p>
          <select
            id="coverageType"
            v-model="coverageType"
            required
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
          >
            <option value="">Select coverage type</option>
            <option value="term-life">Term Life Insurance</option>
            <option value="whole-life">Whole Life Insurance</option>
            <option value="iul">Indexed Universal Life (IUL)</option>
            <option value="not-sure">Not Sure / Need Guidance</option>
          </select>
          <p
            v-if="!coverageTypeError"
            class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            Don't worry if you're not sure - we'll help you choose
          </p>
        </div>
      </div>

      <!-- Health Information Section -->
      <div class="space-y-4">
        <div class="flex items-start justify-between">
          <h3
            class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2 flex-1"
          >
            Health Information
          </h3>
        </div>

        <!-- Health Information Disclaimer -->
        <div
          class="p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-900/20 dark:border-amber-800"
        >
          <p class="text-xs text-amber-700 dark:text-amber-300">
            <strong>Health Information Privacy:</strong> Medical information you
            provide is securely encrypted and used only for insurance
            underwriting purposes. This information helps us find the most
            accurate rates for your situation and is protected under strict
            privacy guidelines.
          </p>
        </div>

        <!-- Health Conditions -->
        <div>
          <label
            for="healthConditions"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Current Health Conditions *
          </label>
          <p
            v-if="healthConditionsError"
            class="text-xs text-red-600 dark:text-red-400"
          >
            {{ healthConditionsError }}
          </p>
          <textarea
            id="healthConditions"
            v-model="healthConditions"
            rows="3"
            required
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
            placeholder="Please describe any current health conditions, chronic illnesses, or ongoing medical treatments. If you're in good health, simply write 'None' or 'Good health'."
          />
          <p
            v-if="!healthConditionsError"
            class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            This helps us find the best rates and is kept strictly confidential
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
          <p
            v-if="medicationsError"
            class="text-xs text-red-600 dark:text-red-400"
          >
            {{ medicationsError }}
          </p>
          <textarea
            id="medications"
            v-model="medications"
            rows="3"
            required
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
            placeholder="Please list all current medications including dosages if known. If none, please write 'None'."
          />
          <p
            v-if="!medicationsError"
            class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
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
          <p v-if="messageError" class="text-xs text-red-600 dark:text-red-400">
            {{ messageError }}
          </p>
          <textarea
            id="message"
            v-model="message"
            rows="3"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
            placeholder="Tell us about your family situation, coverage goals, budget considerations, or any questions you have about life insurance."
          />
          <p
            v-if="!messageError"
            class="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            Help us better understand your needs and goals
          </p>
        </div>
      </div>

      <!-- Health Information Privacy Notice -->
      <div
        class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800"
      >
        <div class="flex items-start space-x-2">
          <div class="text-blue-600 dark:text-blue-400 text-lg">🔒</div>
          <div class="flex-1">
            <h4
              class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1"
            >
              Your Privacy is Protected
            </h4>
            <p class="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Your information is secure and used solely for generating your
              personalized life insurance quote. Health information,
              medications, and personal details are encrypted and protected. We
              do not share or sell your information to third parties.
            </p>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <Button
          v-if="!isSubmitting"
          :disabled="isSubmitting"
          type="submit"
          variant="primary"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700"
        >
          Get My Free Quote
        </Button>
        <div v-else class="flex items-center justify-center">
          <div class="text-sm text-zinc-600 dark:text-zinc-400">
            Submitting...
          </div>
        </div>
      </div>
    </form>

    <!-- Success Message -->
    <div v-else class="mt-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
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

    <!-- Error Message -->
    <div v-if="error" class="mt-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
      <p class="text-sm text-red-700 dark:text-red-400">
        There was an error submitting your request. Please try calling us at
        (930) 322-1962.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import Button from './Button.vue';
import MailIcon from './icons/MailIcon.vue';

const isSubmitting = ref(false);
const submitted = ref(false);
const error = ref(false);

// Validation schema - following portfolio-nuxt pattern
const validations = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[\+]?[1-9]?[\s\-\.\(\)]?[\d\s\-\.\(\)]{9,15}$/,
      'Please enter a valid phone number'
    ),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('age', 'You must be at least 18 years old', function (value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();

      // Check for future dates first
      if (birthDate > today) {
        return this.createError({
          message: 'Date of birth cannot be in the future',
        });
      }

      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        const adjustedAge = age - 1;
        if (adjustedAge < 18) return false;
        if (adjustedAge > 100) {
          return this.createError({
            message: 'Please enter a valid date of birth',
          });
        }
      } else {
        if (age < 18) return false;
        if (age > 100) {
          return this.createError({
            message: 'Please enter a valid date of birth',
          });
        }
      }
      return true;
    }),
  coverageType: yup.string().required('Please select a coverage type'),
  healthConditions: yup
    .string()
    .required(
      'Please provide health conditions information (write "None" if applicable)'
    )
    .min(4, 'Please provide more detailed information or write "None"'),
  medications: yup
    .string()
    .required(
      'Please provide medications information (write "None" if applicable)'
    )
    .min(4, 'Please provide more detailed information or write "None"'),
  message: yup.string(),
});

// Form setup - exactly like portfolio-nuxt
const { handleSubmit } = useForm({
  validationSchema: validations,
});

// Field definitions - following portfolio-nuxt pattern
const { value: firstName, errorMessage: firstNameError } =
  useField('firstName');
const { value: lastName, errorMessage: lastNameError } = useField('lastName');
const { value: email, errorMessage: emailError } = useField('email');
const { value: phone, errorMessage: phoneError } = useField('phone');
const { value: dateOfBirth, errorMessage: dateOfBirthError } =
  useField('dateOfBirth');
const { value: coverageType, errorMessage: coverageTypeError } =
  useField('coverageType');
const { value: healthConditions, errorMessage: healthConditionsError } =
  useField('healthConditions');
const { value: medications, errorMessage: medicationsError } =
  useField('medications');
const { value: message, errorMessage: messageError } = useField('message');

// Computed properties
const maxDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Form submission - following portfolio-nuxt pattern
const onSubmit = handleSubmit(async (formData) => {
  isSubmitting.value = true;
  error.value = false;

  try {
    await $fetch('/api/quote', {
      method: 'POST',
      body: formData,
    });

    submitted.value = true;
  } catch (err) {
    error.value = true;
    console.error('Form submission error:', err);
  } finally {
    isSubmitting.value = false;
  }
});
</script>
