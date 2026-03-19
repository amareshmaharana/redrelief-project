-- RedRelief - MySQL schema reference (generated from Django models).
-- Use Django migrations for source-of-truth schema management.

CREATE TABLE accounts_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT 0,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(254) NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_staff BOOLEAN NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT 0,
    date_joined DATETIME NOT NULL
);

CREATE TABLE accounts_otp_verification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    mobile VARCHAR(15) NOT NULL,
    purpose VARCHAR(30) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    INDEX idx_otp_mobile_purpose_created (mobile, purpose, created_at),
    CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);

CREATE TABLE donors_donor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    blood_group VARCHAR(5) NOT NULL,
    date_of_birth DATE NULL,
    gender VARCHAR(20) NOT NULL DEFAULT '',
    address LONGTEXT NOT NULL,
    last_donation_date DATE NULL,
    emergency_contact VARCHAR(15) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_donor_user FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);

CREATE TABLE recipients_recipient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    address LONGTEXT NOT NULL,
    emergency_contact VARCHAR(15) NOT NULL DEFAULT '',
    id_proof_number VARCHAR(100) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_recipient_user FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);

CREATE TABLE hospitals_hospital (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    hospital_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    address LONGTEXT NOT NULL,
    city VARCHAR(120) NOT NULL,
    state VARCHAR(120) NOT NULL,
    pincode VARCHAR(12) NOT NULL,
    contact_person VARCHAR(120) NOT NULL,
    verification_document VARCHAR(100) NULL,
    is_verified BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_hospital_user FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);

CREATE TABLE camps_blood_camp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    camp_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description LONGTEXT NOT NULL,
    created_by_id BIGINT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_camp_creator FOREIGN KEY (created_by_id) REFERENCES accounts_user(id) ON DELETE SET NULL
);

CREATE TABLE blood_stock_blood_stock (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blood_group VARCHAR(5) NOT NULL,
    units INT UNSIGNED NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL,
    hospital_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_stock_group_expiry (blood_group, expiry_date),
    INDEX idx_stock_hospital_group (hospital_id, blood_group),
    CONSTRAINT fk_stock_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals_hospital(id) ON DELETE CASCADE
);

CREATE TABLE requests_donation_request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    camp_id BIGINT NULL,
    hospital_id BIGINT NULL,
    blood_group VARCHAR(5) NOT NULL,
    units_donated INT UNSIGNED NOT NULL DEFAULT 1,
    medical_report VARCHAR(100) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    admin_message LONGTEXT NOT NULL,
    requested_at DATETIME NOT NULL,
    reviewed_at DATETIME NULL,
    reviewed_by_id BIGINT NULL,
    CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES donors_donor(id) ON DELETE CASCADE,
    CONSTRAINT fk_donation_camp FOREIGN KEY (camp_id) REFERENCES camps_blood_camp(id) ON DELETE SET NULL,
    CONSTRAINT fk_donation_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals_hospital(id) ON DELETE SET NULL,
    CONSTRAINT fk_donation_reviewer FOREIGN KEY (reviewed_by_id) REFERENCES accounts_user(id) ON DELETE SET NULL
);

CREATE TABLE requests_blood_request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    hospital_id BIGINT NULL,
    blood_group VARCHAR(5) NOT NULL,
    units_required INT UNSIGNED NOT NULL,
    medical_report VARCHAR(100) NULL,
    id_proof VARCHAR(100) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    admin_message LONGTEXT NOT NULL,
    requested_at DATETIME NOT NULL,
    reviewed_at DATETIME NULL,
    reviewed_by_id BIGINT NULL,
    CONSTRAINT fk_blood_requester FOREIGN KEY (requester_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_blood_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals_hospital(id) ON DELETE SET NULL,
    CONSTRAINT fk_blood_reviewer FOREIGN KEY (reviewed_by_id) REFERENCES accounts_user(id) ON DELETE SET NULL
);

CREATE TABLE requests_medical_document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_type VARCHAR(40) NOT NULL,
    file VARCHAR(100) NOT NULL,
    donation_request_id BIGINT NULL,
    blood_request_id BIGINT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_doc_user FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_donation FOREIGN KEY (donation_request_id) REFERENCES requests_donation_request(id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_blood FOREIGN KEY (blood_request_id) REFERENCES requests_blood_request(id) ON DELETE CASCADE
);

CREATE TABLE notifications_notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT 0,
    payload JSON NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);
