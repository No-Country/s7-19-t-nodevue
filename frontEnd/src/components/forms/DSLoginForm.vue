<template>
  <form @submit.prevent class="w-80 flex flex-col items-center p-3">
    <img class="w-52" src="@/assets/img/large-logo.svg" alt="" srcset="" />
    <div class="flex w-full flex-col items-center gap-4 mt-10">
      <DSInput placeholder="Ingrese su email" text="Iniciar sesion" v-model="email"></DSInput>
      <DSInput placeholder="Ingrese la contraseña" text="Registarse" v-model="password"></DSInput>
    </div>
    <div class="mt-5">
      <DSButton @click="handleLogin" text="Iniciar Sesion"></DSButton>
    </div>
    <div class="mt-5">
      <p>¿Olvidaste tu contraseña?</p>
      <RouterLink class="underline" to="recover"> accede aqui y recuperala </RouterLink>
    </div>
  </form>
</template>

<script setup>
import DSButton from '../common/DSButton.vue'
import DSInput from '../common/DSInput.vue'
import { login } from '../../services/auth'
import { ref } from 'vue'
import { useProfileStore } from '../../stores/profile'
import { useRouter } from 'vue-router'
import { notify } from 'notiwind'
import { saveProfile } from '../../helpers/localStorage'

const password = ref('')
const email = ref('')
const store = useProfileStore()
const router = useRouter()

const handleLogin = async () => {
  if (email.value.length <= 5 || password.value <= 4) {
    return notify(
      {
        group: 'bottom',
        title: 'Error',
        text: 'Ingrese todos los campos 😥'
      },
      3000
    )
  }

  const response = await login({ email: email.value, password: password.value })
  if (response.data?.user) {
    store.setProfile(response.data.user)
    store.setToken(response.data.token)
    saveProfile({ token: response.data.token, user: response.data.user })
    router.push('/dashboard')
    return notify(
      {
        group: 'top',
        title: 'Success',
        text: 'Inicio de sesion exitoso 👌'
      },
      3000
    )
  }

  notify(
    {
      group: 'bottom',
      title: 'Error',
      text: 'Error de inicio de sesion 😥'
    },
    3000
  )
}
</script>

<style lang="scss" scoped></style>
