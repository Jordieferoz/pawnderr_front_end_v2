"use client";

import Link from "next/link";

export const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-25 bg-white">
      {/* Hero Banner */}
      <div
        className="relative pt-12 pb-20 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7B5EA7 0%, #4F8EF7 100%)"
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
            Terms of Use
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Please read these terms carefully before using PAWnderr.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-16 max-w-4xl">
        <div className="space-y-12 text-gray-600 leading-relaxed text-base">
          {/* Preamble */}
          <div>
            <p className="mb-3 font-semibold text-gray-800 uppercase text-sm tracking-wide">
              PLEASE NOTE THAT YOUR USE OF AND ACCESS TO OUR SERVICES (DEFINED
              BELOW) ARE SUBJECT TO THE FOLLOWING TERMS. IF YOU DO NOT AGREE TO
              ALL OF THE FOLLOWING, YOU MUST NOT USE OR ACCESS THE SERVICES IN
              ANY MANNER.
            </p>
            <p className="mb-3">
              Welcome to PAWnderr! Please read on to learn the rules and
              restrictions that govern the use of our website(s), products,
              services and applications ("Services"). These Terms of Use
              ("Terms") are a binding contract between You (the terms "you",
              "your", "yours" refer to you as a user of the website(s)) and
              PAWnderr ("PAWnderr," "we" and "us"). These Terms include the
              provisions in this document, as well as those in the{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
              . In these Terms, the words "include" or "including" mean
              "including but not limited to", and examples are for illustration
              purposes and are not limiting.
            </p>
            <p className="mb-3">
              These Terms are entered into by and between You and Us. By using
              our services, you accept and agree to be bound and abide by these
              Terms, including the policies referenced in these Terms. Any use
              or access by anyone under the age of 18 is prohibited. By using
              the Platform, you represent and warrant that you meet all of the
              foregoing eligibility requirements and that all personal
              information you provide will be governed by our{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
              . Further, you consent to all actions taken by us in compliance
              with the Privacy Policy. If you do not meet our eligibility
              requirements, you must not access or use the Platform.
            </p>
            <p>
              If you have any questions, comments, or concerns regarding these
              terms or the Services, please{" "}
              <Link
                href="mailto:support@pawnderr.com"
                className="text-blue-600 hover:underline"
              >
                contact us
              </Link>
              .
            </p>
          </div>

          {/* Will these Terms ever change? */}
          <div id="terms-change" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Will these Terms ever change?
            </h2>
            <p className="mb-3">
              We are constantly trying to improve our Services, so these Terms
              may need to change along with the Services. We reserve the right
              to change the Terms at any time, but if we do, we will bring it to
              your attention by placing a notice on the PAWnderr website, by
              sending you an email, or by some other means. Changes will not
              apply retroactively and will become effective no sooner than 14
              days after they are posted. However, changes addressing new
              functions for a Service or changes made for legal reasons will be
              effective immediately.
            </p>
            <p className="mb-3">
              If you don't agree with the new Terms, you are free to reject
              them; however, that would mean you will no longer be able to use
              the Services. If you continue to use the Services in any way after
              a change to the Terms is effective, that shall mean that you agree
              to all of the changes made to the Terms automatically.
            </p>
            <p>
              Except for changes by us as described here, no other amendment or
              modification of these Terms will be effective unless in writing
              and agreed by both you and us.
            </p>
          </div>

          {/* Privacy */}
          <div id="privacy" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              What about my privacy?
            </h2>
            <p>
              PAWnderr takes the privacy of its users very seriously. For the
              current PAWnderr Privacy Policy, please{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                click here
              </Link>
              .
            </p>
          </div>

          {/* Refund Policy */}
          <div id="refunds" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Our refund policy
            </h2>

            <p>We at PAWnderr currently do not offer any refunds.</p>
          </div>

          {/* Basics of using PAWnderr */}
          <div id="basics" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              What are the basics of using PAWnderr?
            </h2>
            <p className="mb-3">
              You may be required to sign up for an account, and select a
              password and username ("PAWnderr User ID"). You promise to provide
              us with accurate, complete, and updated registration information
              about yourself and your pet.
            </p>
            <p className="mb-3">
              You agree that you are solely responsible for maintaining the
              confidentiality of your Account and for all activities that occur
              under it. We shall not under any circumstances be held liable for
              any claims related to the use or misuse of your Account due to the
              activities of any third party outside of our control or due to
              your failure to maintain the confidentiality and security of your
              Account.
            </p>
            <p className="mb-3">
              You agree that PAWnderr is not in any form or manner promoting
              illegal breeding and nor does it encourage any connection for
              breeding. You also agree that if you are found to be engaging in
              illegal breeding your account will be permanently banned from
              PAWnderr.
            </p>
            <p className="mb-3">
              You will only use the Services for your own internal, personal,
              non-commercial use, and not on behalf of or for the benefit of any
              third party, and only in a manner that complies with all laws that
              apply to you. If your use of the Services is prohibited by
              applicable laws, then you aren't authorised to use the Services.
              We are not responsible if you use the Services in a way that
              breaks the law.
            </p>
            <p>
              You will keep all your registration information accurate and
              current. You will not share your account or password with anyone,
              and you must protect the security of your account and your
              password. You're responsible for any activity associated with your
              account. At no point in time will we be liable for any kind of
              losses or damages caused by any unauthorised use of your account,
              and you shall solely be liable for the losses caused to us or
              others due to such unauthorised use, if any.
            </p>
          </div>

          {/* Additional Restrictions */}
          <div id="restrictions" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Are there any additional restrictions on my use of the Services?
            </h2>
            <p className="mb-4">
              You represent, warrant, and agree that you will not contribute any
              Content or User Submission or otherwise use the Services in a
              manner that:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Infringes or violates the intellectual property rights or any other rights of anyone else (including PAWnderr), including privacy and data protection rights, or creates a liability for PAWnderr.",
                "Violates any law or regulation, including any applicable export control laws.",
                "Is harmful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, or otherwise objectionable.",
                "Jeopardizes the security of your PAWnderr account or anyone else's (such as allowing someone else to log into the Services as you).",
                "Attempts, in any manner, to obtain the password, account, or other security information from any other user.",
                "Violates the security of any computer network, or cracks any passwords or security encryption codes.",
                "Copies or stores any significant portion of the Content.",
                "Decompiles, reverse engineers, or otherwise attempts to obtain the source code or underlying ideas or information of or relating to the Services."
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-purple-500 mt-1 flex-shrink-0">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
            <p>
              A violation of any of the foregoing is grounds for termination of
              your right to use or access the Services without notice.
            </p>
          </div>

          {/* Rights in PAWnderr */}
          <div id="your-rights" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              What are my rights in PAWnderr?
            </h2>
            <p className="mb-3">
              The materials displayed or performed or available on or through
              the Services, including text, graphics, data, articles, photos,
              images, illustrations, and User Submissions (collectively, the
              "Content"), are protected by copyright and other intellectual
              property laws. You promise to abide by all copyright notices,
              trademark rules, information, and restrictions contained in any
              Content you access through the Services, and you won't use, copy,
              reproduce, modify, translate, publish, broadcast, transmit,
              distribute, perform, upload, display, license, sell or otherwise
              exploit for any purpose any Content not owned by you, (i) without
              the prior consent of the owner of that Content or (ii) in a way
              that violates someone else's (including PAWnderr's) rights.
            </p>
            <p>
              You understand that PAWnderr owns the Services. You won't modify,
              publish, transmit, participate in the transfer or sale of,
              reproduce (except as expressly provided in this Section), create
              derivative works based on, or otherwise exploit any of the
              Services.
            </p>
          </div>

          {/* Responsibility for content */}
          <div id="responsibility" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Who is responsible for what I see and do on the Services?
            </h2>
            <p className="mb-3">
              The Services may contain links, information or connections to
              third-party websites or services that are not owned or controlled
              by PAWnderr. When you access third-party websites or engage with
              third-party services, you accept that there are risks in doing so,
              and that PAWnderr is not responsible for such risks. We encourage
              you to be aware when you leave the Services and to read the terms
              and privacy policy of each third-party website or service that you
              visit or utilise.
            </p>
            <p className="mb-3">
              PAWnderr has no control over, and assumes no responsibility for,
              the content, accuracy, privacy policies, or practices of or
              opinions expressed in any third-party websites or by any third
              party that you interact with through the Services. By using the
              Services, you release and hold us harmless from any and all
              liability arising from your use of any third-party website or
              service.
            </p>
            <p className="mb-3">
              If there is a dispute between users and any third party, you agree
              that PAWnderr is under no obligation to become involved. If you
              have a dispute with one or more other users, you indemnify
              PAWnderr, its officers, employees, agents, and successors from
              claims, demands, and damages of every kind or nature, known or
              unknown, suspected or unsuspected, disclosed or undisclosed,
              arising out of or in any way related to such disputes or our
              Services.
            </p>
            <p className="mb-3">
              Anything you post, upload, share, store, or otherwise provide
              through the Services is your "User Submission." Some User
              Submissions are viewable by other users. To display your User
              Submissions on the Services, and to allow other users to enjoy
              them (where applicable), you grant us certain rights in those User
              Submissions, subject to our Privacy Policy.
            </p>
            <p className="mb-3">
              For all User Submissions, you grant PAWnderr a license to
              translate, modify (for technical purposes), and reproduce and
              otherwise act with respect to such User Submissions to enable us
              to operate the Services. You acknowledge that PAWnderr may need to
              make changes to your User Submissions to conform and adapt those
              User Submissions to the technical requirements of communication
              networks, devices, services, or media. All licenses you grant
              under these Terms are royalty-free, perpetual, irrevocable, and
              worldwide. These are licenses only — your ownership in User
              Submissions is not affected.
            </p>
            <p>
              If you share a User Submission publicly or provide us with any
              feedback, suggestions, improvements, or feature requests relating
              to the Services (each a "Public User Submission"), then you grant
              PAWnderr the license stated above, as well as a license to
              display, perform, and distribute your Public User Submission for
              the purpose of making it accessible to all PAWnderr users. You
              also grant all other users of the Services a license to access
              that Public User Submission as permitted by the functionality of
              the Services.
            </p>
          </div>

          {/* Trust & Verification */}
          <div id="trust" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Trust & Verification
            </h2>
            <p className="mb-3">
              At PAWnderr we do not engage, allow, or promote breeding, mating
              solicitation, stud offers or puppy sales. We strictly comply with
              applicable government laws and animal welfare regulations. Any
              account attempting this will be mandatorily removed from the
              platform and we shall not be encouraging any form of illegal
              breeding.
            </p>
            <p className="mb-3">
              PAWnderr is a platform solely to connect people with fur babies
              looking to engage in play dates. We advise you to use your utmost
              discretion before meeting any possible matches or people through
              our app.
            </p>
            <p>
              Pet profiles include vaccination information. Reporting tools are
              always available and community moderation ensures fast action when
              needed. Playdates are encouraged to be supervised and planned
              responsibly.
            </p>
          </div>

          {/* Service Changes */}
          <div id="service-changes" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Will PAWnderr ever change the Services?
            </h2>
            <p>
              We're always trying to improve the Services, so they may change
              over time. We may suspend or discontinue any part of the Services,
              or we may introduce new features or impose limits on certain
              features or restrict access to parts or all of the Services. We'll
              try to give you notice when we make a material change to the
              Services that would adversely affect you, but this isn't always
              practical.
            </p>
          </div>

          {/* Cost */}
          <div id="pricing" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Does PAWnderr cost anything?
            </h2>
            <p>
              The PAWnderr Services is a subscription-based model. If you wish
              to continue using such Services, you must pay all applicable fees.
              PAWnderr only offers cancellation of the subscription upon expiry
              of the subscription period opted for initially, and no refunds
              shall be made to any user upon cancellation of the subscription.
            </p>
          </div>

          {/* Stop using PAWnderr */}
          <div id="stopping" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              What if I want to stop using PAWnderr?
            </h2>
            <p className="mb-3">
              You are free to stop using the Service at any time. Please refer
              to our{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              to understand how we treat information you provide to us after you
              have stopped using our Services.
            </p>
            <p className="mb-3">
              PAWnderr is also free to terminate (or suspend access to) your use
              of the Services or your account, for any reason in our discretion,
              including your breach of these Terms. PAWnderr has the sole right
              to decide whether you are in violation of any of the restrictions
              in these Terms.
            </p>
            <p>
              Account termination may result in destruction of any Content
              associated with your account, so keep that in mind before you
              decide to terminate your account.
            </p>
          </div>

          {/* Warranty Disclaimer */}
          <div id="warranty" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Warranty Disclaimer
            </h2>
            <p className="mb-3">
              The content available on PAWnderr may contain typographical errors
              or inaccuracies and may not be complete or current. PAWnderr
              therefore reserves the right to correct any errors, inaccuracies
              or omissions (including after an order has been submitted) and to
              change or update information at any time without prior notice.
            </p>
            <p>
              Neither PAWnderr nor its licensors or suppliers makes any
              representations or warranties concerning any content contained in
              or accessed through the Services. We will not be responsible or
              liable for the accuracy, copyright compliance, legality, or
              decency of material contained in or accessed through the Services.
              Products and services purchased or offered through the Services
              are provided "AS IS" and without any warranty of any kind from
              PAWnderr or others.
            </p>
          </div>

          {/* Intellectual Property Rights */}
          <div id="ip" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Intellectual Property Rights
            </h2>
            <p className="mb-3">
              You acknowledge that we are the sole and exclusive owner of the
              Platform, the services provided by us and its content, and as such
              we are vested with all the Intellectual Property Rights and other
              proprietary rights in the Website — which may include but not be
              limited to text, software, scripts, graphics, maps, photos,
              sounds, music, videos, logos, offers, advertisements, interactive
              features and other materials.
            </p>
            <p className="mb-3">
              PAWnderr logos, trademarks and service marks that may appear on
              the Platform are the property of PAWnderr and are protected under
              Indian and foreign laws. Elements of the Platform are protected by
              trade dress and other international intellectual property laws and
              may not be copied, reproduced, downloaded or distributed in any
              way without the express written consent of PAWnderr.
            </p>
            <p>
              PAWnderr shall not be held liable for the unauthorised use of any
              third-party Intellectual Property Rights. The user that carries
              out such unauthorised use shall fully indemnify and hold PAWnderr
              harmless against any and all claims that may arise as a result of
              such use.
            </p>
          </div>

          {/* Indemnity */}
          <div id="indemnity" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Indemnity
            </h2>
            <p>
              To the fullest extent allowed by applicable law, you will defend,
              indemnify and hold PAWnderr, its affiliates, officers, agents,
              employees, and partners harmless from and against any and all
              claims, liabilities, damages (actual and consequential), losses
              and expenses (including attorneys' fees) arising from or in any
              way related to any third-party claims relating to (a) your
              submissions to the Services including any Content and User
              Submissions, (b) your use of the Services (including any actions
              taken by a third party using your account), and (c) your violation
              of these Terms.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div id="liability" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Limitation of Liability
            </h2>
            <p className="mb-3">
              Neither us nor any of our suppliers will be liable for any damages
              — direct, indirect, incidental, consequential, special, or
              punitive — including, without limitation, loss of data, income,
              profit or goodwill, loss of or damage to property, and claims of
              third parties arising out of your access to or use of the app,
              site, our content, or any member content, however caused, whether
              based on breach of contract, tort (including negligence),
              proprietary rights infringement, product liability or otherwise.
            </p>
            <p className="mb-3">
              The foregoing shall apply even if we were advised of the
              possibility of such damages. If you become dissatisfied in any way
              with the app or site, your sole and exclusive remedy is to stop
              your use of the app and site.
            </p>
            <p>
              You hereby waive any and all claims arising out of your use of the
              app or site. If any portion of this limitation on liability is
              found to be invalid or unenforceable for any reason, then our
              aggregate liability shall not exceed the sum of your subscription
              amount. The foregoing does not apply to liability arising from any
              fraud or fraudulent misrepresentations, or any other liability
              that cannot be limited by applicable law.
            </p>
          </div>

          {/* Assignment */}
          <div id="assignment" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Assignment
            </h2>
            <p>
              You may not assign, delegate or transfer these Terms or your
              rights or obligations hereunder, or your Services account, in any
              way (by operation of law or otherwise) without PAWnderr's prior
              written consent. We may transfer, assign, or delegate these Terms
              and our rights and obligations without consent.
            </p>
          </div>

          {/* Severability */}
          <div id="severability" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Severability
            </h2>
            <p>
              If any court of competent jurisdiction or competent authority
              finds that any provision of these Terms (or part of any provision)
              is invalid, illegal or unenforceable, that provision or
              part-provision shall, to the extent required, be deemed to be
              deleted, and the validity and enforceability of the other
              provisions of these Terms shall not be affected.
            </p>
          </div>

          {/* Termination */}
          <div id="termination" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Termination
            </h2>
            <p>
              You agree that PAWnderr in its sole discretion may deactivate your
              account or otherwise terminate your use of the Platform with or
              without any reason, including, without limitation, if we believe
              that you have (a) breached the Terms; (b) infringed the
              intellectual property rights of a third party; (c) posted,
              uploaded or transmitted unauthorised content on the Platform; or
              (d) violated or acted inconsistently with the letter or spirit of
              these Terms or any other applicable code of conduct. You agree
              that any deactivation or termination of your access may be
              effected without prior notice to you and that we shall not be
              liable to you nor any third party for any such termination. You
              also acknowledge that we may retain and store your information on
              our systems notwithstanding any termination of your account.
            </p>
          </div>

          {/* Jurisdiction */}
          <div id="jurisdiction" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Jurisdiction & Dispute Resolution
            </h2>
            <p className="mb-3">
              The laws of Delhi, India, will apply to any disputes arising out
              of or relating to these Terms or the Services.
            </p>
            <p>
              All claims arising out of or relating to these Terms or the
              Services will be litigated exclusively in Delhi courts, and you
              and PAWnderr consent to personal jurisdiction in those courts.
            </p>
          </div>

          {/* Disclaimer */}
          <div id="disclaimer" className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-grey-900 mb-4 font_fredoka border-b-2 border-purple-100 pb-3">
              Disclaimer
            </h2>
            <p className="mb-3">
              The App, Site, Our Content, and Member Content are all provided to
              you "As Is" and "As Available" without warranty of any kind,
              either express or implied, including but not limited to fitness
              for a particular purpose, title, or non-infringement. Without
              limiting the foregoing, we do not guarantee the compatibility of
              any matches.
            </p>
            <p className="mb-3">
              We do not make any warranties that the app or site will be
              uninterrupted, secure or error free or that your use of the app or
              site will meet your expectations, or that the app, site, our
              content, any member content, or any portion thereof, is correct,
              accurate, or reliable. Your use of the app or site is at your own
              risk. You are solely responsible for your interactions with other
              members.
            </p>
            <p>
              These Terms control the relationship between PAWnderr and you.
              They do not create any third-party beneficiary rights. If you do
              not comply with these Terms, and we don't take action right away,
              this does not mean that we are giving up any rights that we may
              have. If it turns out that a particular term is not enforceable,
              this will not affect any other part of the Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
