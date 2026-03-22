-- LED Ekran Kiralama - Veritabanı Şeması
-- XAMPP phpMyAdmin üzerinden bu dosyayı import edin

DROP DATABASE IF EXISTS ledekran_db;
CREATE DATABASE ledekran_db CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
USE ledekran_db;

-- ===================== KULLANICILAR =====================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin','editor') DEFAULT 'editor',
    avatar VARCHAR(255) DEFAULT NULL,
    token VARCHAR(255) DEFAULT NULL,
    token_expiry DATETIME DEFAULT NULL,
    last_login DATETIME DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== SLIDER / HERO =====================
CREATE TABLE hero_slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    image VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== HİZMETLER =====================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_desc VARCHAR(500),
    icon VARCHAR(50),
    image VARCHAR(255),
    features TEXT,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== ÜRÜNLER =====================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('indoor','outdoor') NOT NULL,
    pixel_pitch VARCHAR(20),
    brightness VARCHAR(20),
    resolution VARCHAR(50),
    panel_size VARCHAR(50),
    weight VARCHAR(20),
    refresh_rate VARCHAR(20),
    best_for VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    is_popular TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== GALERİ =====================
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    image VARCHAR(255) NOT NULL,
    size ENUM('normal','tall','wide') DEFAULT 'normal',
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== REFERANS MÜŞTERİLER =====================
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    logo VARCHAR(255),
    website VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== MÜŞTERİ YORUMLARI =====================
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    company VARCHAR(100),
    text TEXT NOT NULL,
    rating TINYINT DEFAULT 5,
    project VARCHAR(255),
    avatar VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== İLETİŞİM MESAJLARI =====================
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    company VARCHAR(100),
    subject VARCHAR(100),
    event_type VARCHAR(50),
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    is_starred TINYINT(1) DEFAULT 0,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== SİTE AYARLARI =====================
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_group VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================== İSTATİSTİKLER =====================
CREATE TABLE stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    value VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- ===================== AKTİVİTE LOGLARI =====================
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ===================== SEED DATA =====================

-- Admin kullanıcı (kullanıcı adı: admin, şifre: password)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@ledekran.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Kullanıcı', 'admin');

-- İstatistikler
INSERT INTO stats (label, value, icon, sort_order) VALUES
('Tamamlanan Proje', '500+', 'CheckCircle', 1),
('Yıllık Deneyim', '12+', 'Calendar', 2),
('Mutlu Müşteri', '200+', 'Users', 3),
('Teknik Destek', '7/24', 'Headphones', 4);

-- Hizmetler
INSERT INTO services (title, description, short_desc, icon, features, sort_order) VALUES
('Konser & Festival LED Ekran', 'Büyük ölçekli açık hava konser ve festivaller için dev LED ekranlar. P3.9 outdoor paneller ile binlerce kişiye kristal netliğinde görüntü.', 'Dev LED ekranlar ile binlerce kişiye ulaşın.', 'Music', 'Dev boyut seçenekleri,Hava koşullarına dayanıklı,Yüksek parlaklık', 1),
('Kurumsal Etkinlikler', 'Toplantı, seminer, ürün lansmanı ve gala geceleriniz için yüksek çözünürlüklü indoor LED paneller.', 'Profesyonel sunumlar için kristal netliğinde görüntü.', 'Building2', 'P2.5 yüksek çözünürlük,Sessiz çalışma,Kolay içerik yönetimi', 2),
('Fuar & Sergi Standları', 'Fuar standınızı rakiplerinizden öne çıkaracak dikkat çekici LED çözümler.', 'Standınızı LED teknolojisi ile öne çıkarın.', 'Presentation', 'Modüler tasarım,Hızlı kurulum,Özel boyut üretimi', 3),
('Düğün & Özel Organizasyon', 'Özel günlerinize görsel şölen katacak LED ekran ve dekor çözümleri.', 'Özel günlerinize görsel şölen katın.', 'PartyPopper', 'Atmosfer aydınlatma,Video duvar,Canlı yayın desteği', 4),
('Reklam & Tanıtım', 'Mağaza vitrini, AVM ve açık alan reklam ekranları ile markanızı parlak gösterin.', 'Markanızı LED ile parlak gösterin.', 'Megaphone', '7/24 çalışma,Uzaktan içerik yönetimi,Enerji tasarruflu', 5),
('Sahne & TV Prodüksiyon', 'TV setleri, sahne tasarımı ve canlı yayınlar için profesyonel LED çözümler.', 'Profesyonel sahne ve TV çözümleri.', 'Monitor', 'Kamera dostu piksel aralığı,Yüksek yenileme hızı,Renk kalibrasyonu', 6);

-- Ürünler
INSERT INTO products (name, category, pixel_pitch, brightness, resolution, panel_size, weight, refresh_rate, best_for, is_popular, sort_order) VALUES
('P2.5 Indoor Panel', 'indoor', '2.5mm', '1200 nits', '160x160 piksel', '640x640mm', '8.5 kg/panel', '3840 Hz', 'Kurumsal etkinlikler, TV stüdyoları', 1, 1),
('P3.9 Indoor Panel', 'indoor', '3.91mm', '1500 nits', '128x128 piksel', '500x500mm', '7.5 kg/panel', '3840 Hz', 'Konferans, seminer, düğün', 0, 2),
('P3.9 Outdoor Panel', 'outdoor', '3.91mm', '5500 nits', '128x128 piksel', '500x500mm', '8.2 kg/panel', '3840 Hz', 'Konser, festival, açık hava etkinlik', 1, 3),
('P4.8 Outdoor Panel', 'outdoor', '4.81mm', '5500 nits', '104x104 piksel', '500x500mm', '7.8 kg/panel', '1920 Hz', 'Fuar, miting, spor etkinliği', 0, 4),
('P6 Outdoor Panel', 'outdoor', '6mm', '6000 nits', '80x80 piksel', '480x480mm', '7 kg/panel', '1920 Hz', 'Reklam ekranları, uzak mesafe', 0, 5),
('P10 Outdoor Panel', 'outdoor', '10mm', '7000 nits', '32x32 piksel', '320x320mm', '6.5 kg/panel', '1920 Hz', 'Billboard, stadyum, büyük alanlar', 0, 6);

-- Galeri
INSERT INTO gallery (title, category, image, size, sort_order) VALUES
('Rock Festivali LED Ekran', 'Konser', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'tall', 1),
('Kurumsal Lansman', 'Kurumsal', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 'normal', 2),
('Teknoloji Fuarı', 'Fuar', 'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=800&q=80', 'normal', 3),
('Düğün Dekorasyonu', 'Düğün', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', 'wide', 4),
('Açık Hava Konseri', 'Konser', 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=800&q=80', 'normal', 5),
('Kurumsal Toplantı', 'Kurumsal', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 'tall', 6);

-- Referans Müşteriler
INSERT INTO clients (name, category, logo, website, sort_order) VALUES
('Samsung', 'Teknoloji', 'https://logo.clearbit.com/samsung.com', 'https://samsung.com', 1),
('Coca-Cola', 'Sponsor', 'https://logo.clearbit.com/coca-cola.com', 'https://coca-cola.com', 2),
('Mercedes-Benz', 'Otomotiv', 'https://logo.clearbit.com/mercedes-benz.com', 'https://mercedes-benz.com', 3),
('Vodafone', 'Telekom', 'https://logo.clearbit.com/vodafone.com', 'https://vodafone.com', 4),
('Nike', 'Spor', 'https://logo.clearbit.com/nike.com', 'https://nike.com', 5),
('Red Bull', 'Etkinlik', 'https://logo.clearbit.com/redbull.com', 'https://redbull.com', 6),
('Spotify', 'Müzik', 'https://logo.clearbit.com/spotify.com', 'https://spotify.com', 7),
('BMW', 'Otomotiv', 'https://logo.clearbit.com/bmw.com', 'https://bmw.com', 8),
('Adidas', 'Spor', 'https://logo.clearbit.com/adidas.com', 'https://adidas.com', 9),
('Netflix', 'Medya', 'https://logo.clearbit.com/netflix.com', 'https://netflix.com', 10),
('Turkish Airlines', 'Havayolu', 'https://logo.clearbit.com/turkishairlines.com', 'https://turkishairlines.com', 11),
('Turkcell', 'Telekom', 'https://logo.clearbit.com/turkcell.com.tr', 'https://turkcell.com.tr', 12);

-- Müşteri Yorumları
INSERT INTO testimonials (name, role, company, text, rating, project, sort_order) VALUES
('Ahmet Yılmaz', 'Etkinlik Müdürü', 'MegaEvents', 'İstanbul konserinde kullandığımız 120 m² LED ekran muhteşem performans gösterdi. Kurulum ekibi son derece profesyonel ve hızlıydı.', 5, 'İstanbul Açık Hava Konseri', 1),
('Elif Kaya', 'Pazarlama Direktörü', 'TechCorp', 'Ürün lansmanımız için P2.5 indoor paneller kullandık. Görüntü kalitesi inanılmazdı, katılımcılardan çok olumlu geri dönüşler aldık.', 5, 'Ürün Lansmanı', 2),
('Mehmet Demir', 'Genel Müdür', 'ProStage', 'Sahne prodüksiyonlarımızda yıllardır LEDEkran ile çalışıyoruz. Ekipman kalitesi ve teknik destek her zaman en üst seviyede.', 5, 'Sahne Prodüksiyonu', 3),
('Ayşe Öztürk', 'Organizasyon Müdürü', 'GalaOrg', 'Düğün organizasyonlarımızda kullandığımız LED paneller gece görüntüleriyle ortama büyü kattı.', 5, 'Düğün Organizasyonu', 4),
('Can Aktaş', 'Fuar Koordinatörü', 'ExpoCenter', 'Uluslararası fuar standımız için kiraladığımız LED ekranlar standımızı en çok dikkat çeken stand haline getirdi.', 5, 'Uluslararası Fuar', 5),
('Deniz Çelik', 'Yapımcı', 'LiveShow', 'TV programımızın set tasarımında kullanılan LED duvarlar prodüksiyon kalitemizi bir üst seviyeye taşıdı.', 5, 'TV Set Tasarımı', 6);

-- Site Ayarları
INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_title', 'LEDEkran Kiralama', 'general'),
('site_description', 'Profesyonel LED Ekran ve Panel Kiralama Hizmetleri', 'general'),
('phone', '+90 (212) 555 00 00', 'contact'),
('phone2', '+90 (532) 555 00 00', 'contact'),
('email', 'info@ledekran.com', 'contact'),
('email2', 'destek@ledekran.com', 'contact'),
('address', 'Maslak, Büyükdere Cad. No:123, Sarıyer / İstanbul', 'contact'),
('whatsapp', '+905325550000', 'contact'),
('working_hours', 'Pazartesi - Cumartesi, 09:00 - 18:00', 'contact'),
('facebook', 'https://facebook.com/ledekran', 'social'),
('instagram', 'https://instagram.com/ledekran', 'social'),
('twitter', 'https://twitter.com/ledekran', 'social'),
('youtube', 'https://youtube.com/ledekran', 'social'),
('linkedin', 'https://linkedin.com/company/ledekran', 'social'),
('maps_embed', '', 'contact'),
('meta_keywords', 'LED ekran kiralama, LED panel, LED duvar, etkinlik ekranı', 'seo'),
('meta_description', 'Profesyonel LED ekran ve panel kiralama. Konser, fuar, düğün ve kurumsal etkinlikler için.', 'seo');
