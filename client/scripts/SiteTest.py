# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from pyvirtualdisplay import Display
import unittest, time, re, sys
import netifaces as ni

#**set up with your own websites you wish to TestCase
#**these predefined tests could brake at any moment

class SiteTest(unittest.TestCase):

    def setUp(self):

        for retry in range(3):
            try:
                self.driver = webdriver.Firefox()
                break
            except:
                time.sleep(3)

        self.driver.set_window_size(1280, 1024)
        self.driver.set_window_position(200,200)
        self.driver.implicitly_wait(30)
        self.verificationErrors = []
        self.accept_next_alert = True

        self.driver.get("https://www.google.com")
        try:
            element = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "lga")))
        except Exception, e:
            print e

        self.driver.get("https://www.facebook.com/")
        try:
            element = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "globalContainer")))
        except Exception, e:
            print e

        self.driver.get("http://www.espn.com/")
        try:
            element = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "global-viewport")))
        except Exception, e:
            print e

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException, e: return False
        return True

    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException, e: return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True

    def tearDown(self):
        print "\n"
        ni.ifaddresses('eth0')
        MAC = ni.ifaddresses('eth0')[17][0]['addr']
        print MAC
        ip = ni.ifaddresses('eth0')[2][0]['addr']
        print ip

        endTime = time.time()
        print str(endTime) + " " + str(endTime - startTime)
        self.driver.quit()
#        self.driver.Dispose()
        self.driver = None
        self.display.stop()
        self.assertEqual([], self.verificationErrors)


if __name__ == "__main__":
    startTime = time.time()
    unittest.main()
