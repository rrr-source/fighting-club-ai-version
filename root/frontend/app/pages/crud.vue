<template>
  <div>
    <h1>Fighting Club CRUD</h1>

    <!-- COACHES -->
    <section class="block">
      <h2>Coaches</h2>
      <form @submit.prevent="addCoach">
        <input v-model="coachName" placeholder="Coach name" />
        <button type="submit">Add</button>
      </form>
      <ul>
        <li v-for="c in coaches" :key="c.id">
          <input v-model="c.edit" />
          <button @click="updateCoach(c)">Save</button>
          <button @click="removeCoach(c.id)">Delete</button>
        </li>
      </ul>
    </section>

    <!-- WEIGHT CLASSES -->
    <section class="block">
      <h2>Weight Classes</h2>
      <form @submit.prevent="addWeightClass">
        <input v-model="weightClassName" placeholder="Weight class" />
        <button type="submit">Add</button>
      </form>
      <ul>
        <li v-for="wc in weightClasses" :key="wc.id">
          <input v-model="wc.edit" />
          <button @click="updateWeightClass(wc)">Save</button>
          <button @click="removeWeightClass(wc.id)">Delete</button>
        </li>
      </ul>
    </section>

    <!-- FIGHTERS -->
    <section class="block">
      <h2>Fighters</h2>
      <form @submit.prevent="addFighter">
        <input v-model="fighterName" placeholder="Fighter name" />
        <select v-model="fighterCoachId">
          <option disabled value="">Coach</option>
          <option v-for="c in coaches" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
        <select v-model="fighterWeightClassId">
          <option disabled value="">Weight class</option>
          <option v-for="wc in weightClasses" :key="wc.id" :value="wc.id">
            {{ wc.name }}
          </option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ul>
        <li v-for="f in fighters" :key="f.id">
          <input v-model="f.edit" />
          <button @click="updateFighter(f)">Save</button>
          <button @click="removeFighter(f.id)">Delete</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#imports'

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'

const { $db } = useNuxtApp()

const coaches = ref<any[]>([])
const weightClasses = ref<any[]>([])
const fighters = ref<any[]>([])

const coachName = ref('')
const weightClassName = ref('')
const fighterName = ref('')
const fighterCoachId = ref('')
const fighterWeightClassId = ref('')

async function loadAll() {
  const [cSnap, wcSnap, fSnap] = await Promise.all([
    getDocs(collection($db(), 'coaches')),
    getDocs(collection($db(), 'weightClasses')),
    getDocs(collection($db(), 'fighters'))
  ])

  coaches.value = cSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    edit: d.data().name
  }))

  weightClasses.value = wcSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    edit: d.data().name
  }))

  fighters.value = fSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    edit: d.data().name
  }))
}

onMounted(loadAll)

// coaches
async function addCoach() {
  if (!coachName.value.trim()) return
  await addDoc(collection($db(), 'coaches'), { name: coachName.value })
  coachName.value = ''
  loadAll()
}
async function updateCoach(c: any) {
  await updateDoc(doc($db(), 'coaches', c.id), { name: c.edit })
  loadAll()
}
async function removeCoach(id: string) {
  await deleteDoc(doc($db(), 'coaches', id))
  loadAll()
}

// weight classes
async function addWeightClass() {
  if (!weightClassName.value.trim()) return
  await addDoc(collection($db(), 'weightClasses'), { name: weightClassName.value })
  weightClassName.value = ''
  loadAll()
}
async function updateWeightClass(wc: any) {
  await updateDoc(doc($db(), 'weightClasses', wc.id), { name: wc.edit })
  loadAll()
}
async function removeWeightClass(id: string) {
  await deleteDoc(doc($db(), 'weightClasses', id))
  loadAll()
}

// fighters
async function addFighter() {
  if (!fighterName.value || !fighterCoachId.value || !fighterWeightClassId.value)
    return

  await addDoc(collection($db(), 'fighters'), {
    name: fighterName.value,
    coachId: fighterCoachId.value,
    weightClassId: fighterWeightClassId.value,
    createdAt: Date.now()
  })

  fighterName.value = ''
  fighterCoachId.value = ''
  fighterWeightClassId.value = ''
  loadAll()
}

async function updateFighter(f: any) {
  await updateDoc(doc($db(), 'fighters', f.id), { name: f.edit })
  loadAll()
}
async function removeFighter(id: string) {
  await deleteDoc(doc($db(), 'fighters', id))
  loadAll()
}
</script>

<style scoped>
.block {
  margin-bottom: 32px;
}
</style>
