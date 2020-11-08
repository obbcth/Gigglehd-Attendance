import requests
import time, datetime
import schedule
from bs4 import BeautifulSoup

user_id = '@@@'
password = '@@@'

data = {"user_id": user_id, "password": password}

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'https://gigglehd.com/gg/index.php?act=dispMemberLoginForm'
}

def do_attendance():

    with requests.Session() as s:
        req = s.post('https://gigglehd.com/gg/?error_return_url=/gg/&mid=index&vid=&ruleset=@login&act=procMemberLogin&success_return_url=https://gigglehd.com/gg/', data=data, headers=headers)
        html = req.text

        soup = BeautifulSoup(html, 'html.parser')
        username = soup.select('#profile > h2')
        
        print(username[0].text + "님, 환영합니다!")
        
        print("1등 시도")
        
        i = 0
        while i==10:
            req = s.post('https://gigglehd.com/gg/?error_return_url=/gg/attendance&mid=attendance&vid=&ruleset=Attendanceinsert&act=procAttendanceInsertAttendance', headers=headers)
            i = i + 1
        
        time.sleep(1)
        
        req = s.get('https://gigglehd.com/gg/attendance')
        html = req.text

        soup = BeautifulSoup(html, 'html.parser')
        attendcheck = soup.select('#gap > section > div > div:nth-child(8) > div.alert.alert-warning')

        try:
            if (attendcheck[0].text == "출석도장 찍으세요"):
                print("출석이 필요합니다.")
                req = s.post('https://gigglehd.com/gg/?error_return_url=/gg/attendance&mid=attendance&vid=&ruleset=Attendanceinsert&act=procAttendanceInsertAttendance', headers=headers)
                
                print("출석이 완료되었습니다.")

            else:
                print("출석이 이미 완료되었습니다.")
        except:
            print("출석이 이미 완료되었습니다.")

try:

    schedule.every().day.at("00:00").do(do_attendance)

    while True:
        schedule.run_pending()
        time.sleep(1)

except KeyboardInterrupt:

    print("\n\nCtrl+C를 눌러 프로그램을 종료합니다.")
