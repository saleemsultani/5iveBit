import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './IsoStandards.module.css';

// Main component for displaying ISO cybersecurity standards and guidelines
function IsoStandards() {
  //ISO cybersecurity sections and it's content
  const isoSections = [
    {
      id: 'intro',
      title: 'Understanding ISO 27001',
      content: [
        'ISO 27001 is the leading international standard for the management of an ISMS; it provides a holistic approach to information asset protection through a systematic process.',
        'The risk-based approach that the standard takes on information security requires organizations to systematically identify, analyze, and treat information security risks.',
        'ISO 27001 is based on a Plan-Do-Check-Act (PDCA) cycle, which means it encourages continuous improvement of the information security management system.',
        'While the standard is technology-neutral, it deals with technical and organizational aspects of information security, encompassing people, processes, and technology.',
        'The standard is updated on a regular basis to reflect recent security challenges and technologies.'
      ]
    },
    {
      id: 'structure',
      title: 'Key Components of ISO 27001',
      content: [
        'Management Commitment: Ensure leadership support, security policy, and resource allocation for the establishment and maintenance of the ISMS.',
        'Risk Management: Provide a proper risk assessment methodology, risk treatment plans, and acceptance criteria.',
        'Control Implementation: Implement appropriate security controls from Annex A based on the outcome of the risk assessment.',
        'Documentation Framework: Maintain the required documentation, including policies, procedures, records, and evidence of control effectiveness.',
        'Performance Evaluation: Monitoring, measurement, internal audits, and management reviews of the ISMS on a regular basis.'
      ]
    },
    {
      id: 'controls',
      title: 'Essential Security Controls (Annex A)',
      content: [
        'Information Security Policies: Documented policies that are in tune with business objectives and are constantly reviewed and updated.',
        'Access Control: Provisioning and privileged access management including regular access reviews for all users.',
        'Cryptography: Encryption policies, key management procedures and cryptographic controls for the protection of data.',
        'Physical Security: Securing areas, equipment security and clean desk/clean screen policies.',
        'Operations Security: Documenting procedures, protection against malware, logging and operational change management.'
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation Process',
      content: [
        'Initial Assessment: Evaluate the current security posture, including the scope and secure management commitment.',
        'ISMS Planning: The scope of ISMS, the statement of security objectives and the risk assessment methodology are identified.',
        'Risk Assessment: The identification of assets, threats, vulnerabilities and risks to information security is assessed.',
        'Control Selection: The controls selected and implemented are based on the outcomes of the risk assessment.',
        'Documentation: Policies and procedures are developed along with evidence of the operation of the ISMS.'
      ]
    },
    {
      id: 'certification',
      title: 'Certification Process',
      content: [
        'Pre-Assessment: An optional check to identify gaps prior to the formal certification audit.',
        'Stage 1 Audit: he review of ISMS documentation and readiness for stage 2 audit.',
        'Stage 2 Audit: Detailed evaluation regarding the implementation and effectiveness of ISMS.',
        'Certification Decision: Award of certification on successful completion of the audit.',
        'Surveillance Audits: Regular audits to maintain certification status.'
      ]
    },
    {
      id: 'integration',
      title: 'Integration with Other Standards',
      content: [
        'ISO 27002: Detailed guidelines on implementation of security controls for ISO 27001.',
        'ISO 27017/27018: Guidance for cloud security and protection of privacy.',
        'ISO 27701: Extension for the privacy information management system.',
        'Integration with Other Management Systems: Quality (ISO 9001) and IT Service Management (ISO 20000).',
        'Mapping to Other Frameworks: NIST CSF, GDPR, and industry-specific standards.'
      ]
    }
  ];

  return (
    // Main container for the ISO standards page
    <Box className={styles.isoStandardsWrapper}>
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
          ISO Security Standards
        </Typography>
      </Box>

      {/* Main content area with scrollable sections */}
      <Box className={styles.mainContent}>
        {/* Introduction alert box explaining the standard */}
        <Box className={styles.alertBox}>
          <Typography variant="h5" className={styles.alertTitle}>
            Building a Resilient ISMS with ISO 27001
          </Typography>
          <Typography className={styles.alertText}>
            ISO 27001 provides structured guidelines on how to find security weaknesses, implement
            the best controls, and make continuing improvements. This globally recognized standard
            ensures that your information remains confidential and integral, available at any time.
          </Typography>
        </Box>

        {/* Container for all standard section cards */}
        <Box className={styles.contentContainer}>
          {/* Map through each section and create a card */}
          {isoSections.map((section) => (
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

export default IsoStandards;
