<template>
  <v-content>
    <v-form
      ref="login"
      @submit.prevent="onSubmit()"
    >
      <v-text-field
        required
        v-model="form.token"
        prepend-icon="business"
        name="token"
        label="One Time Token"
      ></v-text-field>
      <v-text-field
        required
        v-model="form.pin"
        prepend-icon="person"
        name="pin"
        label="Pin"
      ></v-text-field>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :loading="locked"
          type="submit"
        > Impersonate </v-btn>
      </v-card-actions>
    </v-form>
  </v-content>
</template>

<script>

import gql from 'graphql-tag'
import { Mutations } from '@/store'
import { mapMutations, mapState } from 'vuex'

const IMPERSONATE_MUTATION = gql`
mutation Impersonate($input: IamImpersonationRequest!) {
  iamImpersonate(input: $input){
    token
    success
    reason
    principal {
      username
      identityId
      memberId
      member {
        displayName
      }
    }
  }
}
`

export default {
  name: 'ImpersonatePrompt',
  data () {
    return {
      ...mapState({
        user: state => state.user
      }),
      locked: false,
      form: {
        token: this.$route.params.token || '',
        pin: ''
      }
    }
  },
  methods: {
    ...mapMutations([Mutations.SET_JWT, Mutations.SET_PRINCIPAL, Mutations.TOGGLE_IMPERSONATION]),
    async onSubmit () {
      this.locked = true
      const { token, pin: temporaryPin } = this.form
      try {
        const result = await this.$apollo.mutate({
          mutation: IMPERSONATE_MUTATION,
          variables: {
            input: { token, temporaryPin }
          }
        })
        const { principal, token: jwtToken } = result.data.iamImpersonate

        // const { member, memberId, username, identityId, permissionIds } = principal
        // const { displayName, tenantId } = member

        // const legacy = {
        //   role: 'system_authenticated',
        //   username,
        //   identityId,
        //   memberId,
        //   permissions: permissionIds,
        //   displayName,
        //   tenantId
        // }

        this.setJwt(jwtToken)
        this.setPrincipal(principal)
        this.toggleImpersonation()
        // await this.$store.dispatch(UserActions.LOGIN_SUCCESS, legacy)
        this.$router.push('/dashboard')
      } catch (err) {
        console.warn(err)
        alert('Something went wrong')
      } finally {
        this.locked = false
      }
    }
  }
}

</script>

<style scoped>
.box-card {
  width: 480px;
  margin: auto;
}
.error {
  margin: 5px;
  padding: 10px;
  text-align: center;
}
.logo {
  width: 100%;
  max-width: 250px;
  margin: auto;
  display: block;
}
</style>
