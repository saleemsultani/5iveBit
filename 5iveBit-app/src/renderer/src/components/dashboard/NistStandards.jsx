import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './NistStandards.module.css';

function NistStandards() {
  const nistSections = [
    {
      id: 'intro',
      title: 'Understanding NIST Cybersecurity Framework',
      content: [
        'NIST Cybersecurity Framework is a detailed set of standards and best practices designed by the National Institute of Standards and Technology to enable organizations to manage and reduce cybersecurity risks more effectively.',
        'This framework provides an approach that is flexible, repeatable, and cost-effective in helping organizations identify, assess, and manage cybersecurity risks across their entire infrastructure.',
        'NIST CSF is based on existing standards, guidelines, and practices; thus, it is designed to be consistent with various security requirements, such as ISO 27001, CIS Controls, and industry-specific regulations.',
        'While the framework is voluntary, its widespread adoption within the critical infrastructure sectors has made it the basis of many cybersecurity programs throughout the world.',
        'Technology-neutral and up-to-date against emerging threats, this framework is highly relevant for any organization operating with traditional IT and/or modern cloud-based systems.'
      ]
    },
    {
      id: 'core',
      title: 'Core Functions of NIST Framework',
      content: [
        'Identify: Map your business context, resources, risks, and requirements. Besides that, it also includes asset management, business environment analysis, governance structures, risk assessment, and risk management strategies.',
        'Protect: Provide technical safeguards, including access control, data security, information protection, maintenance, and protective technology. This will also cover awareness training and security procedures.',
        'Detect: Allow timely discovery of cybersecurity events through continuous security monitoring, anomaly detection, and threat hunting. Detection processes are implemented along with the detection systems and are kept updated.',
        'Respond: Design and implement activities to support the detection and response to cybersecurity events, such as response planning, communications, mitigation, analysis, and improvements.',
        'Recover: Maintain resilience plans and restore capabilities impaired by cybersecurity incidents, including recovery planning, strategies for improvement, and effective communications.'
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation Guidelines',
      content: [
        'Current Profile Assessment: Develop a "Current Profile" that accurately characterizes the current cybersecurity activities and results of your organization. This will therefore help in coming up with some gaps in your security posture.',
        'Target Profile Development: Based on your organization\'s desired state of cybersecurity, develop a "Target Profile". Consider the industry requirements, cost-effectiveness, and technical feasibility.',
        'Gap Analysis: Compare Current and Target Profiles to determine gaps. Prioritize gaps based on business needs, resource constraints, and risk management practices.',
        'Implementation Plan: Elaborate on a detailed plan of action regarding the prioritized gaps, including milestones and resources required, and performance measures/metrics for performance monitoring.',
        'Progress Tracking: Follow up steadily on the implementation activities  proposed, using specific performance metrics.'
      ]
    },
    {
      id: 'tiers',
      title: 'Implementation Tiers',
      content: [
        'Tier 1 (Partial): Basic risk management practices, reactive environment. Security activities are irregular and risk decisions are made case by case.',
        'Tier 2 (Risk Informed): Risk management practices approved by management but not organization-wide. Awareness of cybersecurity risk exists but organization-wide approach is missing.',
        'Tier 3 (Repeatable): Organization-wide security policies, standardized practices, and consistent responses. Regular updates to protection measures based on risk assessments.',
        'Tier 4 (Adaptive): Organization adapts based on lessons learned and predictive indicators. Continuous improvement incorporating advanced technologies and practices.',
        'Moving Between Tiers: Progress through tiers based on risk management practices, threat environment, business requirements, and resource constraints.'
      ]
    },
    {
      id: 'controls',
      title: 'Essential Security Controls',
      content: [
        'Access Control: Multi Factor Authentication (MFA), Role-Based Access Control (RBAC), and Periodic Access Review. Every access should be logged and monitored.',
        'Data Protection: Data at rest and data in transit shall be encrypted. Data classification and development of procedures for handling different classes of data. Periodically back up the data considered important and test it.',
        'Network Security: Firewalls, IDS/IPS, Network Segmentation, and Secure Configurations. Periodic vulnerability scanning and performing penetration tests.',
        'Incident Management: The incident response team, procedures, and communication plans should be established, along with regular testing of incident response capabilities.',
        'Supply Chain Security: Third-party risks are assessed and monitored, security requirements for suppliers are defined, and an inventory of supply chain elements is maintained.'
      ]
    },
    {
      id: 'compliance',
      title: 'Regulatory Compliance & Integration',
      content: [
        'Mapping to Regulations: NIST CSF maps major compliance requirements of HIPAA, PCI DSS, GDPR, and all industry-specific regulations.',
        'Documentation Requirements: Detailed documentation is to be maintained about security controls, risk assessments, incident response plans, and exceptions to policy.',
        'Audit Preparation: Periodic internal audits, maintenance of audit trails, and preparation of evidence for external assessments.',
        'Cross-Framework Integration: Mapping of the NIST CSF against ISO 27001, COBIT, and all other industry standards.',
        'Continuous Compliance: Automate the continuous compliance status of an organization through compliance monitoring and reporting tools.'
      ]
    }
  ];

  return (
    <Box className={styles.nistStandardsWrapper}>
      <Box className={styles.headerSection}>
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
          NIST Cybersecurity Framework
        </Typography>
      </Box>

      <Box className={styles.mainContent}>
        <Box className={styles.alertBox}>
          <Typography variant="h5" className={styles.alertTitle}>
            A Practical Guide to the NIST Cybersecurity Framework
          </Typography>
          <Typography className={styles.alertText}>
            Explore the essential components of the NIST Cybersecurity Framework and understand how
            it can improve your organization’s security posture. From its five core functions to its
            flexible implementation tiers, this guide will show you how to tailor a risk management
            strategy that fits your unique operational needs.
          </Typography>
        </Box>

        <Box className={styles.contentContainer}>
          {nistSections.map((section) => (
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

export default NistStandards;
