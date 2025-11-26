<template>
  <div>
    <h1>Fighter Relations</h1>
    <ul>
      <li v-for="f in relations" :key="f.id">
        <strong>{{ f.name }}</strong>
        <span> — Coach: {{ f.coach }}, Weight: {{ f.weightClass }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#imports'
import { collection, getDocs } from 'firebase/firestore'

const { $db } = useNuxtApp()

const relations = ref<any[]>([])

async function load() {
  const [coachesSnap, wcSnap, fightersSnap] = await Promise.all([
    getDocs(collection($db(), 'coaches')),
    getDocs(collection($db(), 'weightClasses')),
    getDocs(collection($db(), 'fighters'))
  ])

  const coachMap = new Map<string, string>()
  coachesSnap.forEach((d) => coachMap.set(d.id, d.data().name))

  const wcMap = new Map<string, string>()
  wcSnap.forEach((d) => wcMap.set(d.id, d.data().name))

  relations.value = fightersSnap.docs.map((d) => {
    const data = d.data() as any
    return {
      id: d.id,
      name: data.name,
      coach: coachMap.get(data.coachId) ?? 'Unknown coach',
      weightClass: wcMap.get(data.weightClassId) ?? 'Unknown class'
    }
  })
}

onMounted(load)
</script>
