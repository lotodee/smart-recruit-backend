interface EmailTemplate {
  subject: string
  body: (params: {
    candidateName: string
    recruiterName: string
    reason?: string
  }) => string
}

interface EmailTemplates {
  [key: string]: {
    [key: string]: EmailTemplate
  }
}

export const emailTemplates: EmailTemplates = {
  "Stage 1": {
    Passed: {
      subject: "Update on Your Application – Punch Digital Agency",
      body: ({ candidateName, recruiterName }) => `Hi ${candidateName},

Thank you once again for completing our coding challenge. We've reviewed your submission and are pleased to inform you that you've successfully passed this stage—congratulations!

We're excited to move forward with the next phase of our hiring process: a second-stage interview. This will give us the opportunity to learn more about you, discuss your approach to the challenge, and explore your potential fit with the Punch Digital team.

You'll receive a separate email within 24 - 48 hours with the scheduled time and a Google Meet link for the onboarding call.

If you have any questions in the meantime, feel free to reach out.

Looking forward to speaking with you soon!

Best regards,
${recruiterName}
Technical Recruiter
Punch Digital Agency`,
    },
    Failed: {
      subject: "Update on Your Application – Punch Digital Agency",
      body: ({ candidateName, recruiterName, reason }) => `Hi ${candidateName},

Thank you for taking the time to complete our coding challenge as part of your application for the MERN Stack Developer position at Punch Digital Agency.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. While we appreciate the effort you put into the challenge, we are seeking candidates whose skills more closely align with our current requirements.

${reason ? `Specifically, our team noted: ${reason}` : ""}

We encourage you to apply for future opportunities (3 to 6 months) with us that match your qualifications and experience. Your interest in Punch Digital Agency is genuinely appreciated, and we wish you all the best in your job search and professional endeavors.

Best regards,
${recruiterName}
Technical Recruiter
Punch Digital Agency`,
    },
  },
  "Stage 2": {
    Passed: {
      subject: "Update on Your Application – Punch Digital Agency",
      body: ({ candidateName, recruiterName }) => `Hi ${candidateName},

Congratulations! We're pleased to inform you that you've successfully passed the second stage of our interview process.

Your performance during our technical discussion was impressive, and we believe your skills and experience would be a valuable addition to our team at Punch Digital Agency.

Our HR team will be in touch shortly to discuss the next steps, including potential compensation, start dates, and other details.

We're excited about the possibility of having you join our team!

Best regards,
${recruiterName}
Technical Recruiter
Punch Digital Agency`,
    },
    Failed: {
      subject: "Update on Your Application – Punch Digital Agency",
      body: ({ candidateName, recruiterName, reason }) => `Hi ${candidateName},

Thank you for taking the time to participate in the second stage of our interview process for the MERN Stack Developer position at Punch Digital Agency.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. While we were impressed with many aspects of your background and skills, we have decided to pursue candidates whose experience more closely aligns with our specific team needs.

${reason ? `The feedback from our team indicated: ${reason}` : ""}

We sincerely appreciate your interest in Punch Digital Agency and the time you've invested in our interview process. We encourage you to keep an eye on our careers page for future opportunities that might be a better match for your skillset.

We wish you the best in your job search and future endeavors.

Best regards,
${recruiterName}
Technical Recruiter
Punch Digital Agency`,
    },
  },
}
