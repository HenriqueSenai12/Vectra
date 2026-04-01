#!/usr/bin/env pybricks-micropython
import os
from pybricks.hubs import EV3Brick
from pybricks.ev3devices import (Motor, TouchSensor, ColorSensor,
                                 InfraredSensor, UltrasonicSensor, GyroSensor)
from pybricks.parameters import Port, Stop, Direction, Button, Color
from pybricks.tools import wait, StopWatch, DataLog
from pybricks.robotics import DriveBase
from pybricks.media.ev3dev import SoundFile, ImageFile



# This program requires LEGO EV3 MicroPython v2.0 or higher.
# Click "Open user guide" on the EV3 extension tab for more information.


# Create your objects here.
ev3 = EV3Brick()

# Definindo os motores
motor_esq = Motor(Port.C)
motor_dir = Motor(Port.A)
VELOCIDADE = 300

STOP_FILE = "/tmp/robot_stop"

def deve_parar():
    return os.path.exists(STOP_FILE)

# Garante que o arquivo de parada não existe ao iniciar
if os.path.exists(STOP_FILE):
    os.remove(STOP_FILE)

while True:
    if deve_parar():
        motor_esq.stop()
        motor_dir.stop()
        break # Sai do programa

    # --- FRENTE ---
    motor_esq.run_time(VELOCIDADE, 2000, then=Stop.BRAKE, wait=False)
    motor_dir.run_time(VELOCIDADE, 2000, then=Stop.BRAKE, wait=True)
    
    if deve_parar(): break
    wait(3000)
    
    # --- TRÁS ---
    motor_esq.run_time(-VELOCIDADE, 2000, then=Stop.BRAKE, wait=False)
    motor_dir.run_time(-VELOCIDADE, 2000, then=Stop.BRAKE, wait=True)
    
    if deve_parar(): break
    wait(3000)