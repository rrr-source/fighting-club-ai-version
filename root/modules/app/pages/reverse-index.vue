<template>
  <div>
    <h1>Weight Class Reverse Index</h1>

    <div class="filter">
      <select v-model="selectedWeightClassId">
        <option value="">All weight classes (raw index)</option>
        <option v-for="wc in weightClasses" :key="wc.id" :value="wc.id">
          {{ wc.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedWeightClassId">
      <h2>Fighters in selected class</h2>
      <ul>
        <li v-for="f in fighters" :key="f.id">
          {{ f.name }}
        </li>
      </ul>
    </div>

    <div v-else>
      <h2>Raw reverse index</h2>
      <ul>
        <li v-for="row in indexDocs" :key="row.id">
          {{ row.id }}: [{{ row.fighterIds.join(', ') }}]
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'        // ✅ добавить
import { useNuxtApp } from '#imports'              // ✅ добавить
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'

const { $db } = useNuxtApp()

const weightClasses = ref<{ id: string; name: string }[]>([])
const indexDocs = ref<{ id: string; fighterIds: string[] }[]>([])
const fighters = ref<{ id: string; name: string }[]>([])
const selectedWeightClassId = ref('')

async function loadIndex() {
  const [wcSnap, indexSnap] = await Promise.all([
    getDocs(collection($db(), 'weightClasses')),
    getDocs(collection($db(), 'weightClassFighters'))
  ])

  weightClasses.value = wcSnap.docs.map((d) => ({
    id: d.id,
    name: d.data().name
  }))

  indexDocs.value = indexSnap.docs.map((d) => ({
    id: d.id,
    fighterIds: d.data().fighterIds ?? []
  }))
}

async function loadFightersForWeightClass(weightClassId: string) {
  const row = indexDocs.value.find((r) => r.id === weightClassId)
  if (!row) {
    fighters.value = []
    return
  }

  const list: { id: string; name: string }[] = []
  for (const fighterId of row.fighterIds) {
    const snap = await getDoc(doc($db(), 'fighters', fighterId))
    if (snap.exists()) {
      list.push({ id: snap.id, name: snap.data().name })
    }
  }
  fighters.value = list
}

watch(selectedWeightClassId, async (val) => {
  if (!val) {
    fighters.value = []
    return
  }
  await loadFightersForWeightClass(val)
})

onMounted(loadIndex)
</script>

<style scoped>
.filter {
  margin-bottom: 16px;
}
</style>
