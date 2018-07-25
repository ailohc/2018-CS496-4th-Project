object Task1 {
  case class Branch(length: Int, child: MyMobile)

  abstract class MyMobile {
    def weightSum: Int = this match {
      case SimpleMobile(w) => w
      case ComplexMobile(lf, ri) => lf.child.weightSum + ri.child.weightSum
    }
  }
  case class SimpleMobile(weight: Int) extends MyMobile
  case class ComplexMobile(left: Branch, right: Branch) extends MyMobile

  def balanced(mobile: MyMobile) : Boolean = mobile match {
    case SimpleMobile(w) => true
    case ComplexMobile(lf, ri) => balanced(lf.child) && balanced(ri.child) && (lf.length * lf.child.weightSum == ri.length * ri.child.weightSum)
  }
  /*
  def main(args: Array[String]) {
    val mobile1 =
      ComplexMobile(Branch(3,
        ComplexMobile(Branch(2, ComplexMobile(Branch(1, SimpleMobile(1)), Branch(1, SimpleMobile(1)))),
          Branch(1, SimpleMobile(4)))),
        Branch(6, SimpleMobile(3)))
    val mobile2 =
      ComplexMobile(Branch(2, SimpleMobile(4)),
        Branch(1, ComplexMobile(Branch(1, SimpleMobile(6)), Branch(1, SimpleMobile(2)))))
    println(balanced(mobile1))
    println(balanced(mobile2))
  } */
}