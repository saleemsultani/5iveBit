import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './BestPractices.module.css';

function BestPractices() {
  const bestPracticesSections = [
    {
      id: 'basics',
      title: 'Essential Security Basics',
      content: [
        'Regular Software Updates: Keep all software, operating systems, and applications up to date.',
        'Strong Password Policy: Implement complex passwords and use password managers.',
        'Multi-Factor Authentication: Enable MFA wherever possible, especially for critical systems.',
        'Data Encryption: Use strong encryption algorithms for sensitive data both in transit and at rest.',
        'Regular Backups: Maintain regular backups of critical data and periodically test recovery procedures.'
      ]
    },
    {
      id: 'code',
      title: 'Secure Coding Practices',
      content: [
        'Input Validation: Validate and sanitize all user inputs to prevent injection attacks.',
        'Secure Authentication: Implement secure session management and strong authentication mechanisms.',
        'Error Handling: Use appropriate error handling techniques without exposing sensitive information.',
        'Secure Dependencies: Regularly audit and update third-party libraries and frameworks.',
        'Code Review: Conduct regular security-focused code reviews to identify and fix vulnerabilities.'
      ]
    },
    {
      id: 'network',
      title: 'Network Security',
      content: [
        'Firewall Configuration: Properly configure and maintain firewalls to restrict unauthorized access.',
        'Network Segmentation: Implement network segregation to isolate critical systems and data.',
        'VPN Usage: Use secure VPN connections for remote access to corporate resources.',
        'SSL/TLS: Implement proper SSL/TLS configuration to protect data in transit.',
        'Regular Scanning: Conduct regular network vulnerability scans to identify and remediate weaknesses.'
      ]
    },
    {
      id: 'data',
      title: 'Data Protection',
      content: [
        'Data Classification: Implement a data classification system to identify and protect sensitive information.',
        'Access Control: Apply the principle of least privilege and grant access on a need-to-know basis.',
        'Data Retention: Define and enforce data retention policies to minimize data exposure.',
        'Secure Disposal: Implement secure data disposal procedures to prevent unauthorized access.',
        'Data Privacy: Comply with relevant data protection regulations such as GDPR or CCPA.'
      ]
    },
    {
      id: 'incident',
      title: 'Incident Response',
      content: [
        'Response Plan: Develop and maintain a comprehensive incident response plan.',
        'Team Roles: Define clear roles and responsibilities for the incident response team.',
        'Communication: Establish clear communication channels for reporting and managing incidents.',
        'Documentation: Maintain detailed incident logs for forensic analysis and lessons learned.',
        'Regular Testing: Conduct regular incident response drills to test and improve response capabilities.'
      ]
    }
  ];

  return (
    <Box className={styles.bestPracticesWrapper}>
      <Box className={styles.headerSection}>
        {/* Back Navigation */}
        <Box className={styles.navigation}>
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
          Best Practices
        </Typography>
      </Box>

      <Box className={styles.mainContent}>
        <Box className={styles.alertBox}>
          <Typography variant="h5" className={styles.alertTitle}>
            Protect Your Business with Cybersecurity Guidelines
          </Typography>
          <Typography className={styles.alertText}>
            Explore our comprehensive cyber security guidelines designed to protect your business
            against rise in cyber crime. Each section below provides essential practices, practical
            tips, and industry-standard recommendations.
          </Typography>
        </Box>

        <Box className={styles.contentContainer}>
          {bestPracticesSections.map((section) => (
            <Box key={section.id} className={styles.sectionCard}>
              <Typography variant="h6" className={styles.sectionTitle}>
                {section.title}
              </Typography>
              <Box className={styles.contentList}>
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

export default BestPractices;
