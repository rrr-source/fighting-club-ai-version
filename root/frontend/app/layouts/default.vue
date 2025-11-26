<template>
  <div>
    <nav class="menu">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/crud">CRUD</NuxtLink>
      <NuxtLink to="/relations">Relations</NuxtLink>
      <NuxtLink to="/reverse-index">Reverse Index</NuxtLink>
    </nav>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
}
.content {
  padding: 16px;
}
</style>