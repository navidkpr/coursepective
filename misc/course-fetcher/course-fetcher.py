import requests
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

p = sync_playwright().start()
browser = p.webkit.launch()

def get_html_from_url(url):
    print(f'getting page content for {url}')
    page = browser.new_page()
    page.goto(url)
    content = page.content()
    return content

def get_courses_from_url(url):
    html = get_html_from_url(url)
    print(html)
    soup = BeautifulSoup(html, 'html.parser')

    courses = []
    for item in soup.select('.views-row')[::2]:
        course = {}
        try:
            course_code_and_name = item.select('h3')[0].get_text().strip()
        except:
            print('course code/name missing')
            continue
        course_code, course_name = course_code_and_name.split(' - ', 1)
        course['course_name'] = course_name
        course['course_code'] = course_code
        try:
            course_description = item.select('div')[0].select('p')[0].get_text().strip()
        except:
            print('course description missing')
            continue
        course['course_description'] = course_description
        try:
            courses.append(course)
        except Exception as e:
            print('FOUND ERROR:', e)
            pass

    return courses

for i in range(1, 50):
    url = f"https://engineering.calendar.utoronto.ca/search-courses?course_keyword=&field_section_value=All&field_subject_area_target_id=All&page={i}"
    courses = get_courses_from_url(url)
    for course in courses:
        body = {
            'courseName': course['course_name'],
            'courseCode': course['course_code'],
            'courseDescription': course['course_description']
        }
        requests.post('http://localhost:8000/courses', json=body)
