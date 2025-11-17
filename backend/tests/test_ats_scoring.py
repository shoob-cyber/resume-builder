from services.ats_scoring import analyze_resume_vs_jd


def test_ats_scoring_basic():
    resume = "Experienced Python developer. Worked with FastAPI, SQLAlchemy, and React."
    jd = "We need a Python developer with FastAPI and SQLAlchemy experience."
    out = analyze_resume_vs_jd(resume, jd)
    assert 'atsScore' in out
    assert 'keywordMatch' in out
    assert out['keywordMatch'] >= 0


def test_ats_requires_jd():
    try:
        analyze_resume_vs_jd("some text", "")
        assert False, "should have raised ValueError"
    except ValueError:
        assert True
