<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import { createComment, getComments } from '../services/comments'
import { useLanguageStore, type TranslationKey } from '../stores/language'
import type { VisitorComment } from '../types/comment'

const props = defineProps<{
  placeId: number
}>()

const languageStore = useLanguageStore()
const comments = ref<VisitorComment[]>([])
const nickname = ref('')
const content = ref('')
const commentInput = ref<HTMLInputElement | null>(null)
const nicknameInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const submitting = ref(false)
const nicknameModalOpen = ref(false)
const loadErrorKey = ref<TranslationKey | null>(null)
const submitErrorKey = ref<TranslationKey | null>(null)
const validationErrorKey = ref<TranslationKey | null>(null)
const submitSuccess = ref(false)
let loadRequestId = 0

function displayNickname(comment: VisitorComment): string {
  return comment.nickname?.trim() || languageStore.t('anonymous')
}

function formatCreatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(languageStore.locale === 'zh' ? 'zh-CN' : 'en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

async function loadComments() {
  const currentRequestId = ++loadRequestId
  loading.value = true
  loadErrorKey.value = null

  try {
    const nextComments = await getComments(props.placeId)
    if (currentRequestId === loadRequestId) {
      comments.value = nextComments
    }
  } catch {
    if (currentRequestId === loadRequestId) {
      comments.value = []
      loadErrorKey.value = 'failedLoadComments'
    }
  } finally {
    if (currentRequestId === loadRequestId) {
      loading.value = false
    }
  }
}

function validateComment(): string | null {
  const trimmedContent = content.value.trim()
  validationErrorKey.value = null
  submitErrorKey.value = null
  submitSuccess.value = false

  if (!trimmedContent) {
    validationErrorKey.value = 'commentEmpty'
    return null
  }

  if (trimmedContent.length > 500) {
    validationErrorKey.value = 'commentTooLong'
    return null
  }

  return trimmedContent
}

async function openNicknameModal() {
  if (!validateComment()) {
    return
  }

  nicknameModalOpen.value = true
  await nextTick()
  nicknameInput.value?.focus()
}

function cancelNicknameModal() {
  if (submitting.value) {
    return
  }

  nicknameModalOpen.value = false
  void nextTick(() => commentInput.value?.focus())
}

async function submitComment() {
  if (submitting.value) {
    return
  }

  const trimmedContent = validateComment()
  if (!trimmedContent) {
    nicknameModalOpen.value = false
    return
  }

  submitting.value = true

  try {
    const newComment = await createComment({
      placeId: props.placeId,
      nickname: nickname.value.trim() || null,
      content: trimmedContent,
    })

    comments.value = [newComment, ...comments.value.filter((comment) => comment.id !== newComment.id)]
    nickname.value = ''
    content.value = ''
    nicknameModalOpen.value = false
    submitSuccess.value = true
  } catch {
    submitErrorKey.value = 'failedPostComment'
  } finally {
    submitting.value = false
  }
}

watch(
  () => props.placeId,
  () => {
    comments.value = []
    nickname.value = ''
    content.value = ''
    nicknameModalOpen.value = false
    validationErrorKey.value = null
    submitErrorKey.value = null
    submitSuccess.value = false
    void loadComments()
  },
  { immediate: true },
)
</script>

<template>
  <section class="visitor-notes" aria-labelledby="visitor-notes-title">
    <h2 id="visitor-notes-title">{{ languageStore.t('visitorNotes') }}</h2>

    <form class="visitor-notes-form" novalidate @submit.prevent="openNicknameModal">
      <label class="visitor-notes-comment-field">
        <span class="sr-only">{{ languageStore.t('comment') }}</span>
        <input
          ref="commentInput"
          v-model="content"
          type="text"
          maxlength="500"
          required
          :placeholder="languageStore.t('writeComment')"
          :disabled="submitting"
        />
      </label>
      <button type="submit" :disabled="submitting">{{ languageStore.t('postComment') }}</button>

      <p v-if="validationErrorKey" class="visitor-notes-error" role="alert">
        {{ languageStore.t(validationErrorKey) }}
      </p>
      <p v-else-if="submitSuccess" class="visitor-notes-success" role="status">
        {{ languageStore.t('commentPosted') }}
      </p>
    </form>

    <p v-if="loading" class="visitor-notes-status" aria-live="polite">
      {{ languageStore.t('loadingComments') }}
    </p>
    <p v-else-if="loadErrorKey" class="visitor-notes-error" role="alert">
      {{ languageStore.t(loadErrorKey) }}
    </p>
    <p v-else-if="comments.length === 0" class="visitor-notes-status">
      {{ languageStore.t('noVisitorNotes') }}
    </p>
    <ul v-else class="visitor-notes-list">
      <li v-for="commentItem in comments" :key="commentItem.id" class="visitor-note-card">
        <div class="visitor-note-heading">
          <strong>{{ displayNickname(commentItem) }}</strong>
          <time :datetime="commentItem.created_at">{{ formatCreatedAt(commentItem.created_at) }}</time>
        </div>
        <p>{{ commentItem.content }}</p>
      </li>
    </ul>

    <Teleport to="body">
      <div
        v-if="nicknameModalOpen"
        class="nickname-modal-backdrop"
        @click.self="cancelNicknameModal"
        @keydown.esc="cancelNicknameModal"
      >
        <section
          class="nickname-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nickname-modal-title"
        >
          <h3 id="nickname-modal-title">{{ languageStore.t('chooseNickname') }}</h3>
          <p>{{ languageStore.t('nicknameOptional') }}</p>

          <form novalidate @submit.prevent="submitComment">
            <label>
              <span>{{ languageStore.t('nickname') }}</span>
              <input
                ref="nicknameInput"
                v-model="nickname"
                type="text"
                :placeholder="languageStore.t('anonymous')"
                :disabled="submitting"
              />
            </label>

            <p v-if="submitErrorKey" class="visitor-notes-error" role="alert">
              {{ languageStore.t(submitErrorKey) }}
            </p>

            <div class="nickname-modal-actions">
              <button
                type="button"
                class="nickname-modal-cancel"
                :disabled="submitting"
                @click="cancelNicknameModal"
              >
                {{ languageStore.t('cancel') }}
              </button>
              <button type="submit" class="nickname-modal-confirm" :disabled="submitting">
                {{ languageStore.t(submitting ? 'postingComment' : 'postComment') }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Teleport>
  </section>
</template>
