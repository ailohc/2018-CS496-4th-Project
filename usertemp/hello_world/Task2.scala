case class CustomException(s: String)  extends Exception(s)

abstract class Expr
case class Var(v: String) extends Expr
case class Const(n: Int) extends Expr
case class Sum(a: Expr, b: Expr) extends Expr
case class Sub(a: Expr, b: Expr) extends Expr
case class Mul(a: Expr, b: Expr) extends Expr
case class Div(a: Expr, b: Expr) extends Expr

object Task2 {

  type Env = String => Int

def eval (exp: Expr, env: Env): Int = exp match {
    case Var(n) => env(n)
    case Const(v) => v
    case Sum(a, b) => eval(a, env) + eval(b, env)
    case Sub(a, b) => eval(a, env) - eval(b, env)
    case Mul(a, b) => eval(a, env) * eval(b, env)
    case Div(a, b) if eval(b, env)!=0 => eval(a, env) / eval(b, env)
    case _ => throw new CustomException("Error")
 }
}