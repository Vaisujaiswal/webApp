import "../styles/dashboard.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <h2>Privacy Policy</h2>
      <p className="privacy-updated">Last updated: July 2026</p>

      <section>
        <h3>1. Introduction</h3>
        <p>
          SmartEnergy values your privacy. This Privacy Policy explains how we
          collect, use, and protect your information when you use our energy
          monitoring and management platform.
        </p>
      </section>

      <section>
        <h3>2. Information We Collect</h3>
        <ul>
          <li>User profile details (name, email, role)</li>
          <li>Device information (appliance name, power, usage hours)</li>
          <li>Energy consumption and cost calculations</li>
        </ul>
      </section>

      <section>
        <h3>3. How We Use Your Information</h3>
        <p>
          The collected data is used to:
        </p>
        <ul>
          <li>Calculate energy usage and costs</li>
          <li>Generate reports and visual analytics</li>
          <li>Provide energy optimization recommendations</li>
        </ul>
      </section>

      <section>
        <h3>4. Data Storage & Security</h3>
        <p>
          For this version of the application, data is stored locally in the
          user’s browser using localStorage. We do not transmit personal data
          to external servers.
        </p>
      </section>

      <section>
        <h3>5. Data Sharing</h3>
        <p>
          SmartEnergy does not sell, trade, or share user data with third
          parties. All information remains private to the user.
        </p>
      </section>

      <section>
        <h3>6. User Control</h3>
        <p>
          Users can modify or delete their device data at any time from the
          dashboard. Clearing browser storage will remove all saved data.
        </p>
      </section>

      <section>
        <h3>7. Changes to This Policy</h3>
        <p>
          This Privacy Policy may be updated as the platform evolves. Users are
          encouraged to review it periodically.
        </p>
      </section>

      <section>
        <h3>8. Contact</h3>
        <p>
          For any privacy-related concerns, please contact the SmartEnergy
          development team.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
