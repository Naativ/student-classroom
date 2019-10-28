import gql from 'graphql-tag'

export const getProfiles = gql`
  query lmsProfiles($input: LmsProfileFilter!) {
    lmsProfiles(input: $input){
      page
      pageSize
      totalPages
      totalResults
      results {
        id
        memberId
        displayName
        avatarUrl
        genderId
        priority
        birthdate
        enrollments {
          id
          courseId
          priority
          lastLessonId
          lastLesson {
            id
            blockId
            name
            key
            description
          }
          nextLessonIds
          nextLessons {
            id
            blockId
            name
            key
            description
          }
        }
      }
    }
  }
`

export const upsertProfile = gql`
  mutation lmsProfileUpsert($input: LmsProfileInput!) {
    lmsProfileUpsert(input: $input) {
      id
      memberId
      displayName
      avatarUrl
      genderId
      priority
      birthdate
      enrollments {
          id
          courseId
          priority
          lastLessonId
          lastLesson {
            id
            blockId
            name
            key
            description
          }
        }
    }
  }
`

export const getGenders = gql`
  query getGenders {
    getGenders {
      id
      name
      key
      isBinary
    }
  }
`

export const getEnrollments = gql`
  query lmsEnrollments($input: LmsEnrollmentFilter!) {
    lmsEnrollments(input: $input){
      page
      pageSize
      totalPages
      totalResults
      results {
        id
        profileId
        courseId
        priority
        lastLessonId
        lastLesson {
          id
          blockId
          name
          key
          description
        }
        nextLessonIds
        nextLessons {
          id
          blockId
          name
          key
          description
        }
      }
    }
  }
`
