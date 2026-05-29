# ARGOS HUD Server
## Briefing
### What is ARGOS HUD Builder?
ARGOS HUD Builder, is a PC application set, primarily for Flight Simulators, that allows you to create custom overlays that feature input visualization and virtual axis/button emulation.
ARGOS HUD Builder follows a client-server architecture, where the client (HERA) is the application you use to create overlays, and the server (ARGOS HUD Server) is the application that runs in the background to handle the communication between your HOTASes and handles XINPUT emulation.

ARGOS HUD Builder is written in TypeScript, and is based on the Electron framework. Client and server communicates over TCP/IP.
### What do I do with it?
It is best used with Flight Simulators and HOTASes. It's even better if you have a second PC that has a touchscreen, and is on the same network with your main PC that hosts the HOTASes, the flight sims: You can install the server on the main PC and the client on the second PC, so your interactions with the overlay doesn't pull the flight sims out of focus.

## Credit
ARGOS HUD Builder is a project that is based on the work of other people. The following people contributed to the development of ARGOS HUD Builder: