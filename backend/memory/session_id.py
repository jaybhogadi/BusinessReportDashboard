from .session_list import *
def session(query):
    
    if "sales" in query or "quantity" in query or "amount" in query:
        session_id="sales_dashboard"
        session_list.append(session_id)
        return session_id
        
    if "agent" in query or "commission" in query:
        session_id="agent_dashboard"
        session_list.append(session_id)
        return session_id
    if "subscription" in query or  "state" in query:
        session_id="subscripton_dashboard"
        session_list.append(session_id)
        return session_id
    else:
        session_id=session_list[-1]
        return session_id
# query="get sales dashboard"
# print(session(query))