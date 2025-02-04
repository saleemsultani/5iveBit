import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './CybercrimeResponse.module.css';

// Main component for displaying Cybercrime response guidelines
function CybercrimeResponse() {
  //Cybercrime response and it's contents
  const cybercrimeResponseSections = [
    {
      id: 'understanding',
      title: 'Understanding Cybercrime Response',
      content: [
        'The response to cybercrime requires immediate, systematic action to limit the damage and preserve evidence.',
        'Faster the reporting through official channels, higher the chances of recovery and prevention of future crimes.',
        'Different types of cybercrimes may require different approaches in terms of reporting and recovery.',
        'Documentation and preservation of evidence are very important for investigation and possible legal proceedings.',
        'Professional support through official channels can guide one through the recovery process.'
      ]
    },
    {
      id: 'reporting',
      title: 'Official Reporting Channels & Support',
      content: [
        <>
          European Union: Europol&apos;s dedicated cybercrime portal provides centralized reporting
          and coordinates with national authorities. -{' '}
          <a
            href="https://www.europol.europa.eu/report-a-crime/report-cybercrime-online"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Report Here
          </a>
        </>,
        <>
          EU Organizations like Computer Emergency Response Team (CERT-EU) offers additional
          specialized support. -{' '}
          <a
            href="https://cert.europa.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Contact Here
          </a>
        </>,
        <>
          United Kingdom: The action fraud platform serves as the national reporting center which
          coordinates with law enforcement. -{' '}
          <a
            href="https://www.actionfraud.police.uk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Report Here
          </a>
        </>,
        <>
          United States: FBI&apos;s Internet Crime Complaint Center (IC3) handles cybercrime reports
          and coordinates responses from local police. -{' '}
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Report Here
          </a>
        </>,
        "Global Cases: INTERPOL's Cybercrime Unit can be reached through local police departments for international incident coordination."
      ]
    },
    {
      id: 'firstResponse',
      title: 'Critical First Response Steps',
      content: [
        'Immediate Containment: The affected systems should be immediately disconnected from the networks while keeping the evidence state.',
        'Documentation of Evidence: Incident documentation, screenshots, and preservation of error messages should be prioritized.',
        'Account Security: Change critical passwords using a trustworthy device and enable two-factor authentication.',
        'Financial Protection: Notify the financial institutions about suspicious transactions.',
        'Preliminary Reporting: Filing of reports as per the level of jurisdiction.'
      ]
    },
    {
      id: 'documentation',
      title: 'Documentation Requirements',
      content: [
        'Incident Timeline: There should be a detailed chronological record of suspicious activities and responses.',
        'System Evidence: It should include logs, screenshots, error messages, and system state information.',
        'Communication Records: All relevant emails, messages, and responses must be kept.',
        'Financial Records: Obtain all transaction logs, unauthorized access attempts, and financial losses.',
        'Response Actions: Document all the steps taken after the incident discovery.'
      ]
    },
    {
      id: 'typeSpecific',
      title: 'Type-Specific Response Protocols',
      content: [
        'Malware & Ransomware: Immediately isolate the infected system and do not pay a ransom unless authorities have been consulted. If clean backups are available, restore them.',
        'Data Breaches: Determine what data may have been compromised and take appropriate legal notification steps. Lock down remaining systems and examine access logs.',
        'Financial Fraud: Immediately call banks to freeze accounts and dispute transactions. Monitor all accounts for additional unauthorized activities.',
        'Account Compromise: Reset passwords of connected accounts, looking for unauthorized changes. If possible, enable advanced security features.',
        'Identity Theft: Contact credit bureaus for fraud alerts and report the compromise of critical documents to the concerned authorities. Keep records of each unauthorized use.'
      ]
    },
    {
      id: 'recovery',
      title: 'Recovery & Prevention Framework',
      content: [
        'System Recovery: Cleaning, restoration of the system, recovery of data, security enhancement should be done immediately.',
        'Access Management: Conduct an in-depth review of access controls and authentication.',
        'Security Updates: System hardening, patch management and vulnerability assessment are the most important actions to minimize further attacks.',
        'Training & Awareness: Review the latest security protocols and user awareness programs.',
        'Monitoring Enhancement: Advanced threat detection, security logging and incident prevention should be implemented.'
      ]
    }
  ];

  return (
    // Main container for the Cybercrime response page
    <Box className={styles.cybercrimeResponseWrapper}>
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
          Understanding & Reporting Cybercrime
        </Typography>
      </Box>
      {/* Main content area with scrollable sections */}
      <Box className={styles.mainContent}>
        {/* Introduction alert box explaining the cybercrime response */}
        <Box className={styles.alertBox}>
          <Typography variant="h5" className={styles.alertTitle}>
            Rapid Response to Cybercrime: A Practical Guide
          </Typography>
          <Typography className={styles.alertText}>
            Learn how to minimize damage, preserve evidence, and report cases through proper
            channels. This guide contains quick steps for containment, documentation, and
            collaboration with authorities that would help you in recovery and prevent future
            attacks.
          </Typography>
        </Box>

        {/* Container for all response section cards */}
        <Box className={styles.contentContainer}>
          {/* Map through each section and create a card */}
          {cybercrimeResponseSections.map((section) => (
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

export default CybercrimeResponse;
