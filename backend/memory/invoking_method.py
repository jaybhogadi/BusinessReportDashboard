from langchain_huggingface import HuggingFaceEndpoint
from langchain.chains import LLMChain
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
import os
from operator import itemgetter
from backend.memory.customtools import *
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.tools.render import render_text_description
from .parsing import *
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from .session_id import session
from backend.memory.get_prompt import load_prompts
from .session_list import session_list


repo_id="mistralai/Mistral-7B-Instruct-v0.3"
os.environ["HUGGINGFACEHUB_API_TOKEN"]="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"
llm=HuggingFaceEndpoint(
    repo_id=repo_id,token=os.environ["HUGGINGFACEHUB_API_TOKEN"]
)
# tool=[display_sales_dashboard_url,display_subscription_dashboard_url,display_agent_dashboard_url,
#       max_avg_aging,product_high_satisfaction,agent_max_commission,sales_query,subscription_query,agent_query]
    #   ,creating_custom_sales_chart,creating_custom_agent_chart,creating_custom_subscription_chart]
tool=[display_sales_dashboard_url,display_subscription_dashboard_url,display_agent_dashboard_url,
      sales_query,subscription_query,agent_query
      ]
      
tools=load_tools([],llm=llm)
for i in tool:
    tools.append(i)
rendered_tools = render_text_description(tools)


def tool_chain(model_output):
    print("model_output-",model_output)
    tool_map = {tool.name: tool for tool in tools}
    chosen_tool = tool_map[model_output["name"]]
    print("chosen_tool-",chosen_tool)
    return itemgetter("arguments") | chosen_tool
store={}
def get_session_history(session_id:str)->BaseChatMessageHistory:
        if session_id not in store:
            store[session_id]=ChatMessageHistory()
        return store[session_id]

configurable={}
chat_history={}
big_list=[]

def invoking(query):
    # system_prompt=main_prompt
    system_prompt=load_prompts("backend/memory/main_prompt.json")
    system_prompt=system_prompt['system_prompt']['prompt_content']
    system_prompt=system_prompt.format(rendered_tools=rendered_tools,query=query)

    
    prompt = ChatPromptTemplate.from_messages(
    [("system", system_prompt),("placeholder","{chat_history}"),("user", "{query}"),]    
    )
    # print(prompt.invoke(query))
    chain=prompt|llm|extract_and_parse_content| RunnablePassthrough.assign(output=tool_chain)
    chain_with_history=RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="query",
        history_messages_key="chat_history",
    )
    session_name=session(query)
    configurable["configurable"]={"session_id":session_name}
    print("-----------------")
    print("configurable:",configurable)
    print("-----------------")
    try:

        result=chain_with_history.invoke(
            {"query":query},
            configurable,
        )
        
        print("with memory")
        print("------------------")
        print(result)
        print("------------------")
        
        # without_memory=output["output"]
        with_memory=result["output"]
        a={"memory": with_memory}
        print(a)

        


        return result["output"]
    except ValueError as e:
        print(f"Error parsing response string: {e}")
        return None
# query="display subscription dashboard for the state montana"
# query="what is the region in the last query? "
# print(prompt.invoke(query))
# query="display sales dashboard of the region south"
# query="display agent commission dashboard of region east"
# query="which agent earns maximum commission"
# query=" which product has maximum average aging "
# query="which product has the highest customer satisfaction rate"
# query="which state has the maximum satisfaction rate"
# query="display bubble chart for quantity sold in 2022"
# print(query)
# output=invoking(query)
# print(output)

# while(True):
#     print("Enter Query")
#     s=input()

#     if s=="no":
#         break
#     output=invoking(s)
#     print("output length", len(output))
#     if len(output)>2:
#         print(output)
#         continue

#     # if output[0]=="sales_dashboard":
#     #     sales_list=store["sales_dashboard"].messages
#     #     print("memory",sales_list)
        
    
            
    
# #     # if output[0]=="agent_dashboard":
# #     #     agent_list=store["agent_dashboard"].messages
# #     #     print("memory",agent_list)
        
            
    
# #     # if output[0]=="subscription_dashboard":
# #     #     subscription_list=store["subscription_dashboard"].messages
# #     #     print("memory",subscription_list)

#     print("final output 1:",output[0])  
#     print("final output 2:",output[1])
    
     
    

#     print(output["output"])
# print(big_list)
# print(len(big_list))
# print(big_list[-1])

# output=invoking(query)
# print("memory",store["sales_dashboard"].messages)
# print(output)
# print(output['output'])
# prompts=prompt.invoke(query)
# print("prompt:",prompts)
# print(query)
# result=chain.invoke(query)
# print(result)

# parsed_content=extract_and_parse_content(result)
# if parsed_content:
#         print("Content")
#         print(json.dumps(parsed_content, indent=4))
# print(type(parsed_content))
# output= RunnablePassthrough.assign(output=tool_chain).invoke(parsed_content)
# print(output['output'])
# bigchain=prompt|llm|extract_and_parse_content|RunnablePassthrough.assign(output=tool_chain)
# output_b=bigchain.invoke(query)
# print("bigchain:",output_b)