# Test Results

<%_  if ( results.result === "error" ) { _%>
<%_      if (results.error_type === "error") { _%>
<span style="color: red"><%= results.message %></span>
<%_      } else if (results.error_type === "assertion_failure") { _%>
<span style="color: red"><%= "Test failure: " %></span><%= results.message %>
<%_      } else if (results.error_type === "protocol_syntax_error") { _%>
<span style="color: red"><%= "Syntax error in protocol: " %></span>
```
  <%- results.message %>
```
<%_      } else if (results.error_type === "protocol_error") { _%>
<span style="color: red"><%= "Execution error in protocol: " %></span><%= results.message %>
<%_      } else if (results.error_type === "test_syntax_error") { _%>
<span style="color: red"><%= "Syntax error in test: " %></span>
```
  <%- results.message %>
```
<%_      } else if (results.error_type === "test_error") { _%>
<span style="color: red"><%= "Execution error in test: " %></span><%- results.message %>
<%_      } _%>

<%_      if (results.exception_backtrace.length > 0) { _%>
<%_          for ( let entry of results.exception_backtrace ) { _%>
- <%= entry %>
<%_          } _%>
<%_      } _%>
<%_    } else { _%>
<span style="color: green">All tests passed.</span>
<%_ } _%>

<%_ if ( results.log.length > 0 ) { _%>
## Log
<%_     for ( let entry of results.log ) { _%>
- <%= entry %>
<%_     } _%>
<%_ } _%>

<%_ if ( results.backtrace.length > 0 ) { _%>
## Backtrace
<%_   for ( var i=1; i < results.backtrace.length; i += 2 ) { _%>
<%_     if ( results.backtrace[i].operation == "display" ) { _%>

### <%= results.backtrace[i-1].time _%>

<%_       let lines = results.backtrace[i].content; _%>
<%_       for ( var j=0; j < lines.length; j++ ) { _%>
- <%- JSON.stringify(lines[j]) %>
<%_       } _%>
<%_     } else if ( results.backtrace[i].operation === "error" ) { _%>
<%- include( 'error.md', { error: results.backtrace[i] } ) _%>
<%_     } _%>
<%_   } _%>
<%_ } _%>