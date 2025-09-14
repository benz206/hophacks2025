from fastapi import FastAPI, Query
from browser_use import Controller, Agent, ChatOpenAI
import os

app = FastAPI()
controller: Controller = None
llm: ChatOpenAI = None

@app.on_event("startup")
async def startup_event():
    global controller, llm
    controller = Controller()
    llm = ChatOpenAI(
        model="gpt-4.1",
        api_key=os.getenv("OPENAI_API_KEY"),
        temperature=0,
    )

@app.on_event("shutdown")
async def shutdown_event():
    if controller:
        await controller.close()

@app.get("/run")
async def run_agent(prompt: str = Query(...)):
    global controller, llm
    agent = Agent(
        task=prompt,
        llm=llm,
        controller=controller,
        use_vision=False,
    )
    result = await agent.run()
    return {"status": "done", "prompt": prompt, "result": str(result)}
