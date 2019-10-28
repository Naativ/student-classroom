<template>
  <v-card class="section">
    <DemoBanner v-if="!isWidget" :demoOpacity="demoOpacity" @hasTag="hasTag" ref="demoBanner" />
    <v-container>
      <v-layout row>
        <v-flex flex d-flex xs12>
          <v-text-field
            v-model="searchTerm"
            :label="$t('search.teachers')"
            :loading="loading"
            @keyup="searchTeachers"
          />
        </v-flex>
        <v-flex xs4 sm3>
          <v-btn
            round
            class="primary text-capitalize"
            @click="searchTeachers"
            >
            {{$t('teachersearch.search')}}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-if="loading" row justify-center>
        <v-progress-circular indeterminate size="64"/>
      </v-layout>
      <div v-if="!loading && noResults">
        <h3>No Results Found</h3>
      </div>
        <v-list three-line>
          <template v-for="(teacher, index) in teachers">
            <v-list-tile :key="index" v-if="teacher.slugSet">
              <v-list-tile-avatar>
                <v-icon v-if="!teacher.attributes.profilePic" x-large>
                  account_circle
                </v-icon>
                <v-img
                  v-if="teacher.attributes.profilePic"
                  :lazy-src="searchChipPlaceholder"
                  :src="getAsset(teacher.attributes.profilePic)"
                  transition="scale-transition"
                />
              </v-list-tile-avatar>
              <v-list-tile-content @click="goTo(teacher)">
                <v-list-tile-title>
                  {{teacher.displayName}} (MRN: {{teacher.mrn}})
                </v-list-tile-title>
                <v-list-tile-sub-title class="subtitle-width">
                  {{teacher.attributes.welcomeMessage}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action class="hidden-xs-only">
                <v-btn v-if="teacher.slugSet" flat color="primary" @click="goTo(teacher)">
                  {{$t('teachersearch.viewprofile')}}
                </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-container>
  </v-card>
</template>

<script>

import { Promise } from 'bluebird'
import { debounce, get, isEmpty } from 'lodash'
import { FIND_MEMBERS } from '@/graphql/Member.js'
import { getMemberAttributes, getMemberInfo } from '@/utils/member/MemberService'
import { getAsset } from '@/utils/AssetService'
import { mapState } from 'vuex'

import DemoBanner from '@/components/DemoBanner'

import searchChipPlaceholder from '@/assets/images/searchChipPlaceholder.svg'

export default {
  name: 'TeacherSearch',
  components: {
    DemoBanner
  },
  props: {
    isWidget: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      tags: state => state.member.tags
    })
  },
  data() {
    return {
      demoOpacity: undefined,
      searchTeachers: debounce(this.searchTeachersDebounce, 500),
      teachers: null,
      getAsset,
      loading: false,
      noResults: false,
      searchChipPlaceholder,
      searchTerm: ''
    }
  },
  methods: {
    goTo(teacher) {
      if (teacher.slugSet) {
        this.$router.push(`/teacher/${teacher.info[0].slugs[0].slug}`)
      }
    },
    hasTag(tag) {
      const tags = this.tags || []
      return tags.indexOf(tag) > -1
    },
    async searchTeachersDebounce() {
      if (!this.searchTerm.length) return
      this.loading = true
      let input = { tags: ['teacher'] }
      if (this.hasTag('system:demo')) { // If in demo mode, only request demo tagged teachers
        input.tags = [ ...input.tags, 'system:demo' ]
      }
      if (/^\s*\d+\s*$/.test(this.searchTerm)) {
        this.searchTerm = parseInt(this.searchTerm)
        input.mrns = [this.searchTerm]
      } else {
        input.query = this.searchTerm
      }

      const { data: { members: { nodes } } } = await this.$apollo.query({
        query: FIND_MEMBERS,
        variables: { input }
      })

      this.teachers = await Promise.map(nodes, async n => {
        const teacherInfo = await getMemberInfo([n.id])
        const teacherAttr = await getMemberAttributes({ memberId: n.id, key: 'teacher-profile' })
        const slugSet = !isEmpty(teacherInfo[0].slugs[0])
        return { ...n, attributes: { ...get(teacherAttr, 'value', {}) }, info: { ...teacherInfo }, slugSet }
      })

      this.noResults = !this.teachers.length
      this.loading = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.subtitle-width
  width: 90%
</style>
