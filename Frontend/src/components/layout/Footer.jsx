import React from 'react'
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram, MessageCircle } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="ml-52 bg-linear-to-r from-[#004B87] to-[#003366]">
      <div className="mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 text-white">
          
          {/* Kantor Pusat */}
          <section className="lg:col-span-1">
            <h2 className="font-bold text-base lg:text-lg mb-3 lg:mb-4 border-b border-white/20 pb-2">Kantor Pusat</h2>
            <address className="not-italic space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p className="opacity-90">Jalan Gubernur H.Ahmad Bastari No. 7 Kel. Silaberanti Kec. Seberang Ulu I Jakabaring Palembang</p>
              </div>
            </address>
            
            <h3 className="font-semibold text-sm lg:text-base mt-4 lg:mt-6 mb-2 lg:mb-3">Hubungi Kami</h3>
            <address className="not-italic space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} aria-hidden="true" />
                <a href="tel:+6271155228080" className="opacity-90 hover:opacity-100 hover:text-[#00AEEF] transition-colors">
                  0711 - 5228080
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} aria-hidden="true" />
                <a href="tel:+6271155228111" className="opacity-90 hover:opacity-100 hover:text-[#00AEEF] transition-colors">
                  0711 - 5228111
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} aria-hidden="true" />
                <a href="mailto:contactcenter@banksumselbabel.com" className="opacity-90 hover:opacity-100 hover:text-[#00AEEF] transition-colors break-all">
                  contactcenter@banksumselbabel.com
                </a>
              </div>
            </address>

            <div className="mt-4 lg:mt-6">
              <p className="font-semibold text-sm mb-2">SWIFT Code: BSSPIDSP</p>
              <p className="text-xs opacity-80 leading-relaxed">Bank Sumsel Babel berizin dan diawasi oleh Otoritas Jasa Keuangan & Bank Indonesia</p>
            </div>
          </section>

          {/* Tentang Kami */}
          <nav aria-label="Tentang Kami">
            <h2 className="font-bold text-base lg:text-lg mb-3 lg:mb-4 border-b border-white/20 pb-2">Tentang Kami</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/majalah-perusahaan" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Majalah Perusahaan
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/whistle-blowing" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Whistle Blowing System
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/tips-keamanan" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Tips Keamanan Bertransaksi
                </a>
              </li>
            </ul>

            <h3 className="font-bold text-sm lg:text-base mt-4 lg:mt-6 mb-2 lg:mb-3">Berita & Pengumuman</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/berita" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Berita
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/pengumuman" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Pengumuman
                </a>
              </li>
            </ul>

            <h3 className="font-bold text-sm lg:text-base mt-4 lg:mt-6 mb-2 lg:mb-3">UMKM</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/umkm-binaan" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  UMKM Binaan
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/klinik-umkm" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Kegiatan Klinik UMKM
                </a>
              </li>
            </ul>
          </nav>

          {/* Produk */}
          <nav aria-label="Produk">
            <h2 className="font-bold text-base lg:text-lg mb-3 lg:mb-4 border-b border-white/20 pb-2">Produk</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/produk/deposito" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Deposito
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/produk/tabungan" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Tabungan
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/produk/giro" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Giro
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/produk/kredit" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Kredit
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/fasilitas-layanan" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Fasilitas Layanan
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/internasional" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Internasional
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/tresuri" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Tresuri
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/bsb-cash" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  BSB Cash
                </a>
              </li>
            </ul>
          </nav>

          {/* Digital Bank & Layanan */}
          <nav aria-label="Layanan Digital">
            <h2 className="font-bold text-base lg:text-lg mb-3 lg:mb-4 border-b border-white/20 pb-2">Digital Bank</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/digital-bank" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Digital bank
                </a>
              </li>
            </ul>

            <h3 className="font-bold text-sm lg:text-base mt-4 lg:mt-6 mb-2 lg:mb-3">Syariah</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/syariah" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Bank Sumsel Babel Syariah
                </a>
              </li>
            </ul>

            <h3 className="font-bold text-sm lg:text-base mt-4 lg:mt-6 mb-2 lg:mb-3">Pengumuman</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/pengadaan" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Pengadaan Barang dan Jasa
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/e-procurement" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  e-Procurement
                </a>
              </li>
            </ul>

            <h3 className="font-bold text-sm lg:text-base mt-4 lg:mt-6 mb-2 lg:mb-3">FAQ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/faq" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Halaman */}
          <nav aria-label="Halaman Lainnya">
            <h2 className="font-bold text-base lg:text-lg mb-3 lg:mb-4 border-b border-white/20 pb-2">Halaman</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.banksumselbabel.com/privasi" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Privasi dan keamanan
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/sbn" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Surat Berharga Negara (SBN)
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/ritel" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Ritel
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/syarat-ketentuan" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Syarat dan Ketentuan
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/garda-siber" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Tim Garda Siber BSB
                </a>
              </li>
              <li>
                <a href="https://www.banksumselbabel.com/sertifikasi-iso" 
                   className="hover:text-[#00AEEF] transition-colors opacity-90 hover:opacity-100 inline-block">
                  Sertifikasi ISO
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6 lg:mt-8">
              <h3 className="font-semibold text-sm lg:text-base mb-3">Ikuti Kami</h3>
              <div className="flex gap-3">
                <a 
                  href="https://facebook.com/banksumselbabel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#00AEEF] p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2 focus:ring-offset-[#004B87]"
                  aria-label="Facebook Bank Sumsel Babel"
                >
                  <Facebook size={18} aria-hidden="true" />
                </a>
                <a 
                  href="https://youtube.com/@banksumselbabel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#00AEEF] p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2 focus:ring-offset-[#004B87]"
                  aria-label="Youtube Bank Sumsel Babel"
                >
                  <Youtube size={18} aria-hidden="true" />
                </a>
                <a 
                  href="https://instagram.com/banksumselbabel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#00AEEF] p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2 focus:ring-offset-[#004B87]"
                  aria-label="Instagram Bank Sumsel Babel"
                >
                  <Instagram size={18} aria-hidden="true" />
                </a>
                <a 
                  href="https://wa.me/6271155228080" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#00AEEF] p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2 focus:ring-offset-[#004B87]"
                  aria-label="WhatsApp Bank Sumsel Babel"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 lg:mt-10 pt-4 lg:pt-6 text-sm">
          <div className="text-white flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
            <p className="opacity-90 text-center md:text-left text-xs lg:text-sm">
              © {currentYear} PT Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung | All Rights Reserved
            </p>
            <nav aria-label="Footer links" className="flex flex-wrap justify-center gap-3 lg:gap-4 text-xs opacity-80">
              <a href="https://www.banksumselbabel.com/privasi" className="hover:text-[#00AEEF] transition-colors hover:opacity-100">
                Privasi dan keamanan
              </a>
              <span aria-hidden="true">•</span>
              <a href="https://www.banksumselbabel.com/syarat-ketentuan" className="hover:text-[#00AEEF] transition-colors hover:opacity-100">
                Syarat dan Ketentuan
              </a>
              <span aria-hidden="true">•</span>
              <a href="https://www.banksumselbabel.com/sitemap" className="hover:text-[#00AEEF] transition-colors hover:opacity-100">
                Peta situs
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;