<template>
  <form @submit.prevent class="w-80 bg-background p-3">
    <div class="w-full h-32">
      <img class="w-40" src="@/assets/img/large-logo.svg" alt="" srcset="" />
    </div>
    <TransitionGroup>
      <div v-if="step === 1" class="flex flex-col items-center gap-4 mt-3">
        <h2 class="text-lg self-start font-semibold mt-2">Datos personales</h2>
        <DSInput placeholder="Nombre" v-model="name"></DSInput>
        <DSInput placeholder="Apellido" v-model="lastName"></DSInput>
        <DSInput placeholder="Email" v-model="email"></DSInput>
        <DSInput placeholder="Contraseña" v-model="password"></DSInput>
      </div>
      <div v-if="step === 2" class="flex flex-col items-center gap-4 mt-3">
        <h2 class="text-lg self-start font-semibold mt-2">Completa tus habilidades</h2>
        <DSInputSearch v-model="skill" @send:item="addSkill" :from="technologies"></DSInputSearch>
        <ul class="flex flex-wrap gap-2 w-full">
          <li
            class="bg-neutral-400 px-3 py-[4px] flex rounded-full items-center gap-1"
            v-for="skill in skills"
            :key="skill.id"
          >
            <p
              class="font-medium text-zinc-800"
              style="
                 {
                  background: rgba(122, 113, 113, 0.56);
                }
              "
            >
              {{ skill.name }}
            </p>
            <img
              @click="removeSkill(skill)"
              class="cursor-pointer top-[1px]"
              src="../../assets/img/delete-tag.svg"
              alt=""
            />
          </li>
        </ul>

        <div class="w-full">
          <p class="text-base font-semibold">¿Actualmente tienes algun proyecto activo?</p>
          <div class="w-full flex gap-12 m-3">
            <div class="flex flex-col items-start">
              <input type="radio" id="huey" name="drone" :value="true" v-model="haveProject" />
              <label for="huey">Si</label>
            </div>

            <div class="flex flex-col items-start">
              <input
                type="radio"
                id="dewey"
                name="drone"
                :value="false"
                v-model="haveProject"
                checked
              />
              <label for="dewey">No</label>
            </div>
          </div>
          <div v-if="haveProject">
            <textarea
              class="bg-neutral-200 border-neutral-600 h-28 p-3 w-full outline-none"
              name=""
              id=""
              placeholder="Descripcion (opcional)"
            ></textarea>
          </div>
        </div>
      </div>
    </TransitionGroup>
    <div class="w-full flex justify-between mt-14">
      <DSButton size="w-24 h-8" @click="decreaseStep" text="Atras"></DSButton>
      <DSButton size="w-24 h-8" @click="handleIncrease" text="Continuar"></DSButton>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import DSButton from '../common/DSButton.vue'
import DSInput from '../common/DSInput.vue'
import DSInputSearch from '../common/DSInputSearch.vue'
import { onMounted } from 'vue'
import { getStacks } from '../../services/stack'
import { register } from '../../services/auth'
import { useRouter } from 'vue-router'
import { notify } from 'notiwind'

const step = ref(1)
const router = useRouter()

const name = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

const skill = ref('')
const skills = ref([])
const technologies = ref([])

onMounted(async () => {
  const response = await getStacks()
  technologies.value = response.data
})

const removeSkill = (skill) => (skills.value = skills.value.filter((s) => s !== skill))

const haveProject = ref(false)

const addSkill = (arg) => {
  if (skills.value.includes(arg)) return
  skills.value.push(arg)
}

const increaseStep = () => {
  if (step.value >= 2) return
  if (name.value.length == 0 || email.value.length == 0 || password.value.length == 0) {
    return notify({
      group: 'bottom',
      title: 'Error',
      text: 'Ingrese todos los campos 😥'
    })
  }
  step.value += 1
}

const decreaseStep = () => {
  if (step.value <= 1) return
  step.value -= 1
}

const handdleRegister = async () => {
  const response = await register({
    name: `${name.value} ${lastName.value}`,
    email: email.value,
    password: password.value,
    stackId: skills.value.map((x) => x.name)
  })
  if (!response?.response?.data?.error) {
    router.push('/login')
    return notify(
      {
        group: 'top',
        title: 'Success',
        text: 'Registro exitoso 👌'
      },
      3000
    )
  }
  decreaseStep()
  return notify({
    group: 'bottom',
    title: 'Error',
    text: `${response.response.data.error} 😥`
  })
}

const handleIncrease = () => {
  if (step.value >= 2) return handdleRegister()
  increaseStep()
}
</script>

<style lang="scss" scoped></style>
