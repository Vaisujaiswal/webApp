import "../styles/dashboard.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function ContactUs() {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p className="contact-subtitle">
        Have questions or feedback? We’d love to hear from you.
      </p>

      <div className="contact-grid">
        {/* CONTACT INFO */}
        <div className="contact-card">
          <h3>Get in Touch</h3>

          <p>
            <FaEnvelope /> support@smartenergy.com
          </p>

          <p>
            <FaPhone /> +91 98765 43210
          </p>

          <p>
            <FaMapMarkerAlt /> Mumbai, India
          </p>

          <small>
            Our team usually responds within 24 hours.
          </small>
        </div>

        {/* CONTACT FORM */}
        <div className="contact-card">
          <h3>Send a Message</h3>

          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>

          <button>Send Message</button>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
