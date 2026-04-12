"use client";

import Link from "next/link";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-25 bg-white">
      {/* Hero Banner */}
      <div
        className="relative pt-12 pb-20 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4F8EF7 0%, #7B5EA7 100%)"
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font_fredoka">
            Privacy Policy
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect
            your data.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-16 max-w-4xl">
        <div className="space-y-12 text-gray-600 leading-relaxed text-base">
          {/* 1. Purpose */}
          <div id="purpose" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              1. Purpose of this Privacy Policy
            </h2>
            <p className="mb-3">
              Welcome, and thank you for your interest in PAWnderr. This Privacy
              Policy is meant to help you understand what information we
              collect, why we collect it, and how you can update, manage,
              export, and delete your information.
            </p>
            <p className="mb-3">
              It also describes your choices regarding use, access, withdrawal
              of consent and correction of your personal information. The use of
              information collected through our Service(s) shall be limited to
              the purpose of providing you the service that you have chosen.
            </p>
            <p className="mb-3">
              All data collected by PAWnderr shall be governed by the{" "}
              <strong>Digital Personal Data Protection Act, 2023</strong>. The
              privacy of our Website users — whether you are our former or
              existing registered user or merely a visitor — is very important
              to us and we are strongly committed to your right to privacy and
              to keeping your personal and other information secure.
            </p>
            <p>
              If you have any questions about this Privacy Policy, you can
              contact us through{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                PAWnderr Support
              </Link>
              .
            </p>
          </div>

          {/* 2. Data We Collect */}
          <div id="data-we-collect" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              2. Data We Collect
            </h2>
            <p className="mb-3">
              When you registered your account, we made this Privacy Policy and
              our information handling practices available to you. This Privacy
              Policy only covers PAWnderr's practices regarding personal
              information.
            </p>
            <p className="mb-3">
              We will ask for your consent before using your information for a
              purpose not covered in this Privacy Policy. You may decline to
              share certain personal information with PAWnderr, in which case
              PAWnderr may not be able to provide some features and
              functionality found on the Services.
            </p>
            <p className="mb-3">
              When you create a PAWnderr account you provide us with personal
              information that includes your name and a password. You may also
              provide your mailing address, home or mobile phone number, or
              other personal information about yourself or your pet.
            </p>
            <p>
              We also collect the content you create, upload, or receive from
              others when using our Services — including messages you write and
              receive.
            </p>
          </div>

          {/* 3. Purpose of Collecting */}
          <div id="purpose-of-collecting" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              3. Purpose of Collecting Personal Data
            </h2>
            <p className="mb-4">
              The main reason we process your data is to provide our service to
              you and improve it over time, while connecting you with members
              who might make a better match for your fur babies. In addition to
              verifying your identity, we collect and process your Personal Data
              for a variety of reasons including:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Deliver our services and provide you with the websites and applications, together with any support you may request.",
                "Develop new services and enhance existing ones.",
                "Respond to your inquiries or fulfil your requests.",
                "Diagnose technical problems.",
                "Relay announcements, newsletters, and event information.",
                "Prevent, detect, and mitigate any fraudulent activities.",
                "Contact you via email, phone, WhatsApp, text, or other similar channels to offer you our services and relevant offers.",
                "Comply with our legal obligations, resolve disputes with users, and enforce our agreements."
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
            <p>
              PAWnderr also uses your email address or other personal
              information to send you messages about the Services and
              communications from other Members, as well as messages related to
              activities of third parties we work with.
            </p>
          </div>

          {/* 4. Automatically Collected */}
          <div id="automatically-collected" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              4. Information Collected Automatically
            </h2>
            <p className="mb-4">
              We collect information about the apps, browsers, and devices you
              use to access our Services. This automatically collected
              information may include:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">IP Address:</strong> Your
                  Internet Protocol address or other device address or ID.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Browser & Device:</strong>{" "}
                  Your web browser or device type and operating system.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Navigation Data:</strong>{" "}
                  The web pages or sites you visit just before or just after the
                  Services, and the pages you view on the Services.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Timestamps:</strong> The
                  dates and times that you visit the Services.
                </p>
              </li>
            </ul>
            <p className="mb-3">
              We may use various technologies to collect and store information,
              including cookies, pixel tags, local storage, databases, and
              server logs.
            </p>
            <p>
              We also collect information about your activity in our Services,
              which may include views and interactions with content and ads,
              people with whom you communicate or share content, and which
              datasets you view or download.
            </p>
          </div>

          {/* 5. Cookies */}
          <div id="cookies" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              5. Cookies & Tracking Technologies
            </h2>
            <p className="mb-4">
              When you use the Services, we send one or more cookies — small
              text files containing a string of alphanumeric characters — to
              your computer. PAWnderr may use both session cookies and
              persistent cookies.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Session Cookies:</strong>{" "}
                  Disappear after you close your browser.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Persistent Cookies:</strong>{" "}
                  Remain after you close your browser and may be used on
                  subsequent visits to the Services. These can be removed via
                  your browser's settings.
                </p>
              </li>
            </ul>
            <p className="mb-3">
              If you delete, or choose not to accept, cookies from the Services,
              you may not be able to utilise the features of the Services to
              their fullest potential.
            </p>
            <p>
              We may also implement third-party content on the Services — such
              as advertising or analytic services — that uses "clear gifs," "web
              beacons," or other similar techniques, which allow the third-party
              content provider to read and write cookies to your browser. This
              information is collected directly by the third party and is
              subject to that third party's own data collection, use, and
              disclosure policies.
            </p>
          </div>

          {/* 6. Data Retention */}
          <div id="data-retention" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              6. Data Retention
            </h2>
            <p className="mb-3">
              At PAWnderr we keep your personal data only as long as necessary
              for legitimate business reasons and as permitted by applicable
              law.
            </p>
            <p className="mb-3">
              You may update, correct, or delete your profile information and
              preferences at any time by accessing your account settings page or
              editing your PAWnderr account profile through the Services.
            </p>
            <p className="mb-4">
              You can request deletion of your entire PAWnderr account by making
              a request on your app or through an email sent to{" "}
              <a
                href="mailto:support@pawnderr.com"
                className="text-blue-600 hover:underline"
              >
                support@pawnderr.com
              </a>
              .
            </p>
            <p className="mb-3">
              Sometimes business and legal requirements require us to retain
              certain information for an extended period of time, including but
              not limited to:
            </p>
            <ul className="space-y-2">
              {[
                "Security, fraud, and abuse prevention.",
                "Financial record-keeping.",
                "Complying with legal or regulatory requirements.",
                "Ensuring the continuity of our services."
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* 7. Sharing of Information */}
          <div id="sharing-information" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              7. Sharing of Information
            </h2>
            <p className="mb-4">
              Many of our Services let you share information with other people,
              and you have control over how you share. Any information you
              voluntarily include in an area accessible to other PAWnderr
              members — such as a public profile page — will be available to
              other members who access that content. We disclose your personal
              information in the following cases:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">With your consent:</strong>{" "}
                  We'll share personal information outside of PAWnderr when we
                  have your explicit or implied consent.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Service Providers:</strong>{" "}
                  We share information with suppliers, subcontractors, and
                  service providers including technology, telecom, and internet
                  providers to maintain an efficient business.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Legal Requirements:</strong>{" "}
                  We will share personal information if required by applicable
                  law, regulation, legal process, or enforceable governmental
                  request; or to detect, prevent, or address fraud, abuse,
                  security, or technical issues.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">
                    Professional Advisers:
                  </strong>{" "}
                  With legal advisors and external auditors for legal advice and
                  business audits.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Business Transfers:</strong>{" "}
                  In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred as part of that transaction.
                </p>
              </li>
            </ul>
            <p>
              We may share non-personally identifiable information publicly and
              with our partners — like publishers, advertisers, and developers —
              to show trends about the general use of our Services.
            </p>
          </div>

          {/* 8. Data Security */}
          <div id="security" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              8. Data Security
            </h2>
            <p className="mb-3">
              PAWnderr uses a variety of physical, managerial, and technical
              safeguards designed to improve the security of our systems and
              your personal information.
            </p>
            <p className="mb-3">
              We cannot, however, ensure or warrant the security of any
              information you transmit to PAWnderr, nor can we guarantee that
              such information may not be accessed, disclosed, altered, or
              destroyed by breach of any of our physical, technical, or
              managerial safeguards. You transfer your information to PAWnderr
              at your own risk.
            </p>
            <p>
              If PAWnderr learns of a security breach, we will notify you in
              accordance with applicable law.
            </p>
          </div>

          {/* 9. Third Party Websites */}
          <div id="third-party" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              9. Third Party Websites
            </h2>
            <p className="mb-3">
              The Services contain links to websites and services provided by
              third parties. Any personal information you provide on third-party
              sites or services is provided directly to that third party and is
              subject to that third party's policies governing privacy and
              security.
            </p>
            <p>
              We are not responsible for the content or privacy and security
              practices and policies of third-party sites or services to which
              links are displayed on the Services. We encourage you to learn
              about third parties' privacy and security policies before
              providing them with personal information.
            </p>
          </div>

          {/* 10. Your Rights */}
          <div id="your-rights" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              10. Your Rights
            </h2>
            <p className="mb-4">
              You have control over your personal information and choices over
              how it is used. Your rights include:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">
                    Access & Correction:
                  </strong>{" "}
                  You may update or correct your profile information at any time
                  through your account settings.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">
                    Withdrawal of Consent:
                  </strong>{" "}
                  You may withdraw consent where processing is based on consent.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Cookie Control:</strong> You
                  can configure your browser to block cookies or indicate when
                  PAWnderr has set a cookie. Note that our Services rely on
                  cookies to function properly.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  <strong className="text-grey-900">Account Deletion:</strong>{" "}
                  You can request full account deletion via the app or by
                  emailing{" "}
                  <a
                    href="mailto:support@pawnderr.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@pawnderr.com
                  </a>
                  .
                </p>
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us through{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                PAWnderr Support
              </Link>
              .
            </p>
          </div>

          {/* 11. Children's Privacy */}
          <div id="children" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              11. Children's Privacy
            </h2>
            <p>
              PAWnderr is not directed to individuals under the age of 18. We do
              not knowingly collect personal information from minors. If we
              become aware that we have collected data from anyone under 18, we
              will promptly delete it.
            </p>
          </div>

          {/* 12. Changes to This Policy */}
          <div id="changes" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              12. Changes to This Policy
            </h2>
            <p className="mb-3">
              We change this Privacy Policy from time to time. We will not
              reduce your rights under this Privacy Policy without your explicit
              consent.
            </p>
            <p className="mb-3">
              Please note that our amended Privacy Policy will become effective
              on a going-forward basis as stated in the{" "}
              <Link
                href="/terms-of-use"
                className="text-blue-600 hover:underline"
              >
                Terms of Use
              </Link>
              , except that:
            </p>
            <ul className="space-y-2 mb-3">
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  Unless you agree otherwise, we will use your personal
                  information in the manner described in the Privacy Policy in
                  effect when we received that information.
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <p>
                  If you do not agree with any changes to the Privacy Policy,
                  you must terminate your PAWnderr membership and cease use of
                  the Services.
                </p>
              </li>
            </ul>
            <p>
              Your continued use of the Services after a revised Privacy Policy
              has become effective indicates that you have read, understood, and
              agreed to the current version of the Privacy Policy.
            </p>
          </div>

          {/* 13. Contact Us */}
          <div id="contact" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-blue-100 pb-3">
              13. Contact Us
            </h2>
            <p className="mb-3">
              Please contact PAWnderr with any questions or comments about this
              Privacy Policy, your personal information, our use and disclosure
              practices, or your consent choices through{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                PAWnderr Support
              </Link>{" "}
              or by emailing us at{" "}
              <a
                href="mailto:privacy@pawnderr.com"
                className="text-blue-600 hover:underline"
              >
                privacy@pawnderr.com
              </a>
              .
            </p>
            <p>
              By accessing our Website and using it on a continued basis, you
              expressly consent and confirm to PAWnderr collecting, maintaining,
              using, processing, and disclosing your Personal Information in
              accordance with this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
