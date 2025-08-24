import Debug "mo:base/Debug";

actor Hefin {
  stable var messages : [Text] = [];

  public func greet(name : Text) : async Text {
    Debug.print("Greeting " # name);
    return "Hello, " # name # " 👋 from HEFIN canister!";
  };

  public func addMessage(msg : Text) : async () {
    messages := Array.append(messages, [msg]);
  };

  public query func getMessages() : async [Text] {
    return messages;
  };
};
