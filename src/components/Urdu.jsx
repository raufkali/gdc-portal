import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Urdu = () => {
  // Font styles for reuse
  const nastaliqFont = "'Noto Nastaliq Urdu', serif";
  const headingFont = "'Noto Nastaliq Urdu', serif";

  return (
    <>
      {/* Dynamic Font Import & Professional Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
          
          body {
            overflow-x: hidden;
          }
          .urdu-text {
            font-family: ${nastaliqFont};
            line-height: 2.2;
          }
          .urdu-heading {
            font-family: ${headingFont};
            line-height: 1.8;
          }
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.1) !important; }
          .btn-info { background-color: #00a2ff; border-color: #00a2ff; }
          .text-info { color: #00a2ff !important; }
          .rounded-5 { border-radius: 2.5rem !important; }
        `}
      </style>

      <div className="bg-white min-vh-100" style={{ direction: 'rtl' }}>
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(15, 30, 60, 0.85), rgba(15, 30, 60, 0.85)), url('https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "550px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-info text-uppercase fw-bold mb-3 urdu-text" style={{ letterSpacing: "2px", fontSize: "1.1rem" }}>
              ادب، تہذیب اور شعور
            </h6>
            <h1 className="display-2 fw-bold mb-4 urdu-heading">
              شعبۂ <span className="text-info">اُردو</span>
            </h1>
            <p className="lead mx-auto opacity-75 mb-4 urdu-text" style={{ maxWidth: "800px", fontSize: "1.4rem" }}>
              زبان، ادب، تحقیق اور تنقید کا حسین امتزاج — جہاں علم اور فن ایک ساتھ جلوہ گر ہوتے ہیں۔
            </p>
            <div className="d-flex justify-content-center gap-3">
               <button className="btn btn-info btn-lg rounded-pill px-5 fw-bold text-white shadow-lg urdu-text">تعلیمی پروگرامز</button>
               <button className="btn btn-outline-light btn-lg rounded-pill px-5 urdu-text">تحقیقی مجلے</button>
            </div>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "سالِ قیام", val: "۲۰۱۰" },
              { label: "ماہر اساتذہ", val: "۰۸+" },
              { label: "کامیابی کا تناسب", val: "۹۸٪" },
              { label: "تحقیقی مقالے", val: "۵۰+" }
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4 rounded-4 bg-white">
                  <h3 className="fw-bold text-dark mb-0">{stat.val}</h3>
                  <small className="text-muted fw-bold urdu-text" style={{ fontSize: '0.9rem' }}>{stat.label}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ABOUT SECTION --- */}
        <div className="container py-5 my-5">
          <div className="row align-items-center g-5 text-end">
            <div className="col-lg-6 order-lg-2">
              <div className="ps-lg-5">
                <h2 className="fw-bold text-dark display-5 mb-4 urdu-heading">شعبے کا تعارف</h2>
                <p className="text-secondary fs-5 mb-4 urdu-text">
                  شعبۂ اُردو، گورنمنٹ ڈگری کالج گُلاباد میں زبان و ادب کا ایک مضبوط علمی مرکز ہے۔ یہاں طلبہ کو کلاسیکی، جدید اور معاصر اُردو ادب کی تدریس کے ساتھ ساتھ تخلیقی صلاحیتوں کو نکھارنے کے مواقع فراہم کیے جاتے ہیں۔
                </p>
                <div className="border-end border-info border-4 pe-4 my-4 bg-light p-4 rounded-start shadow-sm">
                  <p className="fst-italic text-dark fs-5 mb-0 urdu-text">
                    "ہمارا نصب العین طلبہ میں اعلیٰ ادبی ذوق پیدا کرنا اور انہیں معاشرے کا ایک باشعور شہری بنانا ہے۔"
                  </p>
                </div>
                <div className="row g-3">
                    {["تخلیقی تحریر", "لسانی تحقیق", "تنقیدی مطالعہ"].map((item, i) => (
                        <div key={i} className="col-4 small fw-bold text-info urdu-text">
                            <i className="bi bi-check-circle-fill me-2"></i> {item}
                        </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img 
                src="https://images.unsplash.com/photo-1544648156-5388451882c5?auto=format&fit=crop&w=800&q=80" 
                alt="Urdu Literature Background" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="bg-light py-5">
          <div className="container py-4 text-center">
            <h2 className="fw-bold mb-2 urdu-heading">تعلیمی پروگرامز</h2>
            <p className="text-muted mb-5 urdu-text">ادب اور زبان کی ترویج کے لیے ہمارے بنیادی کورسز</p>
            <div className="row g-4 text-end">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-book text-info fs-3"></i>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3 urdu-text">انٹرمیڈیٹ</span>
                   </div>
                   <h4 className="fw-bold urdu-heading">ایف اے (اُردو)</h4>
                   <p className="text-secondary urdu-text">زبان، غزل، نظم اور نثر کے بنیادی مطالعہ کے ساتھ ساتھ ادبی تاریخ کا ابتدائی احاطہ۔</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted urdu-text"><i className="bi bi-dot text-info"></i> قواعد و انشاء</div>
                      <div className="col-6 small text-muted urdu-text"><i className="bi bi-dot text-info"></i> اصنافِ سخن</div>
                   </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-mortarboard text-primary fs-3"></i>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3 urdu-text">گریجویٹ</span>
                   </div>
                   <h4 className="fw-bold urdu-heading">بی ایس اُردو</h4>
                   <p className="text-secondary urdu-text">کلاسیکی ادب، جدید رجحانات، تحقیق اور تنقید کے ساتھ ساتھ لسانیات کی مکمل تعلیم۔</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted urdu-text"><i className="bi bi-dot text-primary"></i> تاریخِ ادب</div>
                      <div className="col-6 small text-muted urdu-text"><i className="bi bi-dot text-primary"></i> عمرانی لسانیات</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CURRICULUM ROADMAP --- */}
        <div className="container py-5 my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold urdu-heading">تعلیمی سفر</h2>
            <div className="mx-auto bg-info mt-2" style={{ height: '3px', width: '60px' }}></div>
          </div>
          <div className="row g-4">
            {[
              { phase: "مرحلہ ۱", title: "بنیادی ادب", desc: "اُردو زبان کے بنیادی قواعد اور نثر کا مطالعہ۔", color: "bg-info" },
              { phase: "مرحلہ ۲", title: "کلاسیکی شاعری", desc: "غالب، میر اور اقبال کی شاعری کا فکری جائزہ۔", color: "bg-primary" },
              { phase: "مرحلہ ۳", title: "فنِ تنقید", desc: "ادبی نظریات اور تنقیدی دبستانوں کا مطالعہ۔", color: "bg-dark" },
              { phase: "مرحلہ ۴", title: "تحقیق و مقالہ", desc: "ادبی تحقیق کے اصول اور تحقیقی مقالے کی تکمیل۔", color: "bg-info" }
            ].map((c, i) => (
              <div key={i} className="col-md-3">
                <div className="p-4 rounded-4 border-0 shadow-sm bg-white text-center h-100 hover-lift border-top border-info border-4">
                  <span className={`badge ${c.color} mb-3 px-3 py-2 rounded-pill urdu-text`}>{c.phase}</span>
                  <h6 className="fw-bold text-dark mb-2 urdu-heading">{c.title}</h6>
                  <p className="small text-muted mb-0 urdu-text">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FACULTY SECTION --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold urdu-heading">ہمارے اساتذہ</h2>
            <p className="text-muted urdu-text">اعلیٰ تعلیمی قابلیت اور ادبی تجربہ رکھنے والے ماہرینِ تعلیم</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "پروفیسر محمد عمران", role: "صدر شعبہ / ایسوسی ایٹ پروفیسر", spec: "ایم فل اردو ادب", icon: "bi-person-badge" },
              { name: "ڈاکٹر عائشہ رحمان", role: "اسسٹنٹ پروفیسر", spec: "پی ایچ ڈی اقبالیات", icon: "bi-person-check" },
              { name: "مس ساجدہ پروین", role: "لیکچرار", spec: "ایم فل لسانیات", icon: "bi-person-video3" }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-5 h-100 text-center hover-lift">
                  <div className="mx-auto bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-inner" style={{ width: "90px", height: "90px" }}>
                    <i className={`bi ${f.icon} display-5`}></i>
                  </div>
                  <h5 className="fw-bold mb-1 urdu-heading">{f.name}</h5>
                  <p className="text-info small fw-bold text-uppercase mb-2 urdu-text">{f.role}</p>
                  <div className="mt-auto pt-3 border-top">
                    <small className="text-secondary fst-italic urdu-text">خصوصیت: {f.spec}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="container mb-5">
          <div className="p-5 rounded-5 bg-dark text-white text-center shadow-lg">
            <h2 className="fw-bold mb-3 urdu-heading">علمی قافلے کا حصہ بنیں</h2>
            <p className="opacity-75 mb-4 urdu-text" style={{ fontSize: "1.2rem" }}>تعلیمی سال ۲۰۲۶ کے داخلے جاری ہیں۔ اردو زبان و ادب کی ترویج میں ہمارا ساتھ دیں۔</p>
            <button className="btn btn-info text-white px-5 py-3 rounded-pill fw-bold urdu-text shadow">ابھی داخلہ لیں</button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Urdu;