<template>
  <div>
    <Maintenance v-if="flags.maintenance"/>
    <NaativHeader v-else alt/>
    <v-layout column wrap>
      <div class="mt-110">
        <v-layout class="privacy" align-center justify-space-around>
          <v-layout wrap justify-space-around align-center class="privacy-title">
            <h1>Privacy Policy</h1>
          </v-layout>
        </v-layout>
      </div>
        <v-layout wrap justify-space-around align-center>
          <h3>May 9, 2019</h3>
        </v-layout>
      <v-layout class="privacy-body" column left>
        <p>
          Languages, LLC dba Naativ (the “Company”) is committed to protecting your privacy.
          This Privacy Policy section communicates how, when, and why we gather information about our
          customers and what we do with it.
        </p>
        <p>
          If you have any questions about the Company privacy policies please contact us at <a href="mailto:support@naativ.com">support@naativ.com</a>.
        </p>
        <p>
          You agree that your use of the website signifies your assent to this Privacy Policy. If you do not
          agree with this Privacy Policy, you are not authorized to use this website.
        </p>
        <h3>
          Information Collected
        </h3>
        <p>
          If you subscribe to the Company and/or place an order through the Company’s website (the “Site”),
          we will ask you for your name, e-mail address, shipping address, telephone number and credit card
          information. We use this information to process and fulfill your order and to notify you of your
          order status. All archived credit card information is maintained in a secure and safe environment.
          Telephone numbers and e-mail addresses are used to contact you regarding your order. The Company
          will never sell, rent or share your personal information, including your e-mail address, with any
          third parties for marketing purposes without your express permission. You may be liable for unauthorized
          use of our Site, as well as have your private information used by others. In addition, we may
          automatically gather certain information about the use of the Site, such as how frequently certain
          areas of the Site are visited, including the use of cookies and other technologies. Most browsers
          can be set to prevent cookies or to notify you when one is being placed. However, cookies are necessary
          to access the Site.
        </p>
        <h3>How We Use Your Information</h3>
        <p>
          In connection with their performance of services to maintain and operate the Site and certain features
          on the Site, certain trusted third parties may be permitted to access your information. For example,
          we may use third parties to host the Site; operate various features available on the Site; send emails;
          analyze data; provide search results and links and assist in fulfilling your orders.
        </p>
        <p>
          We may transfer personally identifiable information as an asset in connection with a proposed or actual
          merger or sale (including any transfers made as part of an insolvency or bankruptcy proceeding) involving
          all or part of our business or as part of a corporate reorganization, stock sale or other change in control.
          In such a circumstance the transferee would be bound by the terms of this privacy policy.
        </p>
        <p>
          We reserve the right to disclose information in order to comply with a subpoena, court order, administrative
          or governmental order, or any other requirement of law, or when we, in our sole discretion, believe it is
          necessary in order to protect our rights or the rights of others, to prevent harm to persons or property,
          to fight fraud and credit risk reduction.
        </p>
        <p>
          We use non-personally identifiable information in the aggregate, so that we can improve the Site and for
          business and administrative purposes. We may also use or share with third parties for any purpose aggregated
          data that contains no personally identifiable information.
        </p>
        <p>
          If you submit your email address to be added to a mailing list, we will use the email address for the sole
          purpose of sending you announcements, special offers from the Company and other partners along with site updates.
        </p>
        <p>
          We use your feedback to improve our Site and our organization. If you choose to provide information about
          yourself using a feedback or email form on our Site, we will not use the information for any purpose other
          than to respond to your inquiry or to act on your suggestion or comment. We will not share your information
          with others except with your permission or upon your request.
        </p>
        <p>
          Comments you voluntarily post on public forums, if any, on our Site will, of course, be displayed publicly
          along with the name you submit.
        </p>
        <h3>How We Protect Your Information:</h3>
        <p>
          We are committed to protecting the information we receive from you. We follow reasonable technical and
          management practices to help protect the confidentiality, security and integrity of data stored on our
          system. While no computer system is completely secure, we believe the measures we have implemented reduce
          the likelihood of security problems to a level appropriate to the type of data involved.
        </p>
        <h3>Privacy Policy Changes</h3>
        <p>
          If we decide to change our Privacy Policy for the Site, we will post the revised Privacy Policy here so
          that you will always know what information we gather, how we might use that information and whether we
          may disclose it to anyone. Your continued use of the Site indicates your assent to the Privacy Policy as posted.
        </p>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Maintenance from '@/components/Maintenance.vue'
import featureFlags from '@/utils/FeatureFlags'
import NaativHeader from '@/components/Header.vue'

export default {
  name: 'PrivacyPolicy',
  components: {
    Maintenance,
    NaativHeader
  },
  data() {
    return {
      flags: featureFlags
    }
  }
}
</script>

<style lang="stylus" scoped>

h1
  margin-bottom 40px
.mt-110
  margin-top 110px
.privacy
  margin-top 30px

.privacy-title
  height 100px
  left 0
  max-width 100%
  position absolute
  right 0
  z-index 1

.privacy-body
  font-size 18px
  margin 5%
  .privacy-link
    word-break break-all
  ul
    margin-bottom 20px
</style>
