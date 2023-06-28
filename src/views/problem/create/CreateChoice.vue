<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const probType = route.params.type as 'choice' | 'blank' | 'answer'


</script>
