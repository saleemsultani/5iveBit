import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './EnisaStandards.module.css';

// Main component for displaying ENISA cybersecurity standards and guidelines
function EnisaStandards() {
  //ENISA framework sections and their content
  const enisaSections = [
    {
      id: 'intro',
      title: 'Understanding ENISA Framework',
      content: [
        "ENISA, or the European Union Agency for Cybersecurity, is essentially the Union's central cybersecurity agency, which has the objective of developing a high common level of cybersecurity across Europe.",
        'It provided detailed guidelines to implement cybersecurity across all EU member states and brought harmony in security approaches.',
        'ENISA standards align with major EU regulations, including the NIS2 Directive (Network and Information Security) and GDPR (General Data Protection Regulation).',
        'The framework emphasizes cross-border cooperation and information sharing between member states to strengthen EU-wide cyber resilience.',
        'ENISA regularly updates its guidelines to address emerging threats and technological developments in the cybersecurity landscape.'
      ]
    },
    // Additional sections defining ENISA standards and requirements
    {
      id: 'principles',
      title: 'Core Principles & Objectives',
      content: [
        'Risk-Based Approach: Implements security measures based on systematic risk assessment and threat analysis specific to EU contexts.',
        'Cross-Border Cooperation: Enables information sharing and response mechanisms among EU member states and relevant stakeholders.',
        'Incident Reporting: Provides standard procedures for reporting significant cybersecurity incidents to relevant national authorities.',
        'Capacity Building: Helps in development of cybersecurity skills and knowledge across different sectors and member states.',
        'Harmonized Standards: Helps in establishing and maintaining a level of consistency regarding standards in cybersecurity within the European Union.'
      ]
    },
    {
      id: 'measures',
      title: 'Security Measures Framework',
      content: [
        'Technical Controls: The deployment of security technologies including encryption, access controls, and network security.',
        'Organizational Measures: Organization-wide security governance structures, policies, and procedures in line with relevant EU requirements.',
        'Personnel Security: Adequate training of staff, security awareness programs, and a clear definition of security responsibilities within the organization.',
        'Incident Management: Complete incident detection, response, and recovery procedures.',
        'Business Continuity: Ensuring service continuity and disaster recovery capabilities in line with EU standards.'
      ]
    },
    {
      id: 'sectors',
      title: 'Sector-Specific Guidelines',
      content: [
        'Critical Infrastructure: Enhanced security measures for essential services including energy, transport, and healthcare sectors.',
        'Cloud Services: Security requirements with regard to cloud services offered within the EU and data protection measures.',
        '5G Networks: Security guidelines relating to 5G infrastructure when deploying and operating them by member states.',
        'IoT Security: Standards for Internet of Things devices and networks, ensuring security by design.',
        'AI Systems: Security and ethical guidelines for artificial intelligence applications in the EU context.'
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation Steps',
      content: [
        'Initial Assessment: Evaluate the present security posture against the requirements of ENISA and EU regulations.',
        'Gap Analysis: Identify areas requiring improvement to meet ENISA standards and compliance requirements.',
        'Control Implementation: Implement all required security controls and measures according to the guidelines of ENISA.',
        'Monitoring & Reporting: Establish continuous monitoring systems and regular reporting mechanisms.',
        'Review & Update: Regular assessment and updating of security measures to maintain effectiveness.'
      ]
    },
    {
      id: 'certification',
      title: 'Compliance & Certification',
      content: [
        'EU Cybersecurity Certification Framework: The standardised certification schemes for the ICT products, services, and processes.',
        'Assurance Levels: Basic, Substantial, and High. Three levels of assurance corresponding to the level of risk and specific security needs.',
        'Certification Process: Structured evaluation and certification procedures recognized across EU member states.',
        'Maintenance Requirements: Ongoing compliance monitoring and periodic reassessment of certifications.',
        'International Recognition: Alignment with international standards and mutual recognition arrangements.'
      ]
    }
  ];

  return (
    // Main container for the ENISA standards page
    <Box className={styles.enisaStandardsWrapper}>
      {/* Header section with navigation and title */}
      <Box className={styles.headerSection}>
        <Box className={styles.navigation}>
          {/* Back button with conditional navigation based on entry point */}
          <IconButton
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search);
              const fromNavbar = urlParams.get('from') === 'navbar';
              window.location.href = fromNavbar ? '/chat' : '/dashboard';
            }}
            className={styles.backButton}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h3" className={styles.header}>
          ENISA Security Standards
        </Typography>
      </Box>

      {/* Main content area with scrollable sections */}
      <Box className={styles.mainContent}>
        {/* Introduction alert box explaining the framework */}
        <Box className={styles.alertBox}>
          <Typography variant="h5" className={styles.alertTitle}>
            Securing Europe&apos;s Digital Future
          </Typography>
          <Typography className={styles.alertText}>
            Step into the future of European cybersecurity with the broad framework presented by
            ENISA. Understand how such standards address emerging technology issues, critical
            infrastructure protection, and secure digital transformation across the EU while keeping
            the highest bar for data protection and operational resilience.
          </Typography>
        </Box>

        {/* Container for all framework section cards */}
        <Box className={styles.contentContainer}>
          {/* Map through each section and create a card */}
          {enisaSections.map((section) => (
            <Box key={section.id} className={styles.sectionCard}>
              <Typography variant="h6" className={styles.sectionTitle}>
                {section.title}
              </Typography>
              <Box className={styles.contentList}>
                {/* Map through content items in each section */}
                {section.content.map((item, index) => (
                  <Box key={index} className={styles.listItem}>
                    <Box className={styles.bullet} />
                    <Typography className={styles.itemText}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default EnisaStandards;
