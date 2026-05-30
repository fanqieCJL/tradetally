<template>
  <div class="relative w-full" @click="openPicker">
    <input
      type="text"
      :id="id"
      :class="['w-full cursor-pointer', inputClass]"
      :value="displayText"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required && !modelValue"
      readonly
      @keydown.enter="$emit('enter', $event)"
    />
    <input
      ref="pickerRef"
      type="date"
      tabindex="-1"
      aria-hidden="true"
      :value="modelValue || ''"
      :disabled="disabled"
      :min="min"
      :max="max"
      class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      @input="onPickerInput"
      @change="onPickerChange"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatAppDate, getAppDateInputPlaceholder } from '@/utils/date'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  min: {
    type: String,
    default: undefined
  },
  max: {
    type: String,
    default: undefined
  },
  inputClass: {
    type: String,
    default: 'input'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'enter'])

const { locale } = useI18n()
const pickerRef = ref(null)

const placeholder = computed(() => {
  void locale.value
  return getAppDateInputPlaceholder()
})

const displayText = computed(() => {
  void locale.value
  if (!props.modelValue) return ''
  return formatAppDate(props.modelValue)
})

function onPickerInput(event) {
  emit('update:modelValue', event.target.value)
}

function onPickerChange(event) {
  emit('change', event)
}

function openPicker() {
  if (props.disabled) return
  const picker = pickerRef.value
  if (!picker) return
  if (typeof picker.showPicker === 'function') {
    picker.showPicker()
  } else {
    picker.click()
  }
}
</script>
